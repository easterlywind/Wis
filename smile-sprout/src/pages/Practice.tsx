import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";

const emotions = [
  { id: "happy", emoji: "😊", name: "Vui vẻ", instruction: "Cười tươi lên nhé!" },
  { id: "sad", emoji: "😢", name: "Buồn", instruction: "Hơi buồn chút nào." },
  { id: "angry", emoji: "😠", name: "Giận", instruction: "Nhíu mày lại nào!" },
  { id: "surprised", emoji: "😲", name: "Ngạc nhiên", instruction: "Mắt mở to nhé!" },
];

const AI_API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000";

const Practice = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [selectedEmotion, setSelectedEmotion] = useState(emotions[0]);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [matchPercentage, setMatchPercentage] = useState(0);

  // normal mode
  const [hasMatched, setHasMatched] = useState(false);

  // auto mode
  const [autoMode, setAutoMode] = useState(false);
  const [emotionIndex, setEmotionIndex] = useState(0);

  // ============ 1. CAMERA ============
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      setCameraActive(true);
      toast.success("Camera đã bật!");
    } catch (err) {
      console.error(err);
      toast.error("Không thể bật camera");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // ============ 2. GỬI 1 FRAME LÊN API ============
  /**
   * Trả về true nếu frame hiện tại đạt đúng emotion mục tiêu với conf >= 80
   */
  const detectOneFrame = async (): Promise<boolean> => {
    if (!videoRef.current) return false;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    canvas.width = 640;
    canvas.height = 360;
    ctx.drawImage(videoRef.current, 0, 0, 640, 360);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await fetch(`${AI_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        setMatchPercentage(0);
        return false;
      }

      const detected = data.emotion?.toLowerCase();
      const confidenceRaw = data.confidence ?? data.score ?? data.prob ?? 0;
      const confidence =
        confidenceRaw <= 1 ? Math.round(confidenceRaw * 100) : Math.round(confidenceRaw);

      const targetId = autoMode ? emotions[emotionIndex].id : selectedEmotion.id;

      // Có cùng nhãn cảm xúc không?
      const isSameLabel = detected === targetId;

      // 🔢 Confidence hiển thị trên UI:
      // - Nếu đúng nhãn → dùng confidence thật
      // - Nếu sai nhãn → random 0–50%
      const displayConfidence = isSameLabel
        ? confidence
        : Math.floor(Math.random() * 51); // 0..50

      // Cập nhật thanh độ khớp
      if (autoMode) {
        // auto-mode: luôn show displayConfidence
        setMatchPercentage(displayConfidence);
      } else {
        // normal mode: chỉ update khi chưa match để khỏi nhảy lung tung sau khi xong
        if (!hasMatched) {
          setMatchPercentage(displayConfidence);
        }
      }

      // Điều kiện "qua bài"
      const ok = isSameLabel && confidence >= 80;

      return ok;

    } catch (err) {
      console.error("Detection error:", err);
      setMatchPercentage(0);
      return false;
    }
  };

  // ============ 3. VÒNG LẶP 1.5s (THAY CHO setInterval) ============
  useEffect(() => {
    // Không bật loop nếu chưa bật camera
    if (!cameraActive) return;

    let cancelled = false;

    const loop = async () => {
      // nếu ở normal mode mà đã match thì không detect nữa
      if (!autoMode && hasMatched) return;

      while (!cancelled && cameraActive) {
        const ok = await detectOneFrame();

        if (autoMode) {
          if (ok) {
            toast.success(`Hoàn thành: ${emotions[emotionIndex].name}! 🎉`);

            // 👇 GIỮ THANH ĐỘ KHỚP LẠI ~1.2s CHO NGƯỜI DÙNG XEM
            await new Promise((resolve) => setTimeout(resolve, 1200));

            const next = emotionIndex + 1;
            if (next < emotions.length) {
              // chuyển sang cảm xúc tiếp theo
              setEmotionIndex(next);
              setMatchPercentage(0);   // reset thanh về 0 cho emotion mới
            } else {
              // hoàn thành toàn bộ
              toast.success("🎉 Bạn đã hoàn thành tất cả cảm xúc!");
              setAutoMode(false);
            }

            // dừng vòng lặp hiện tại – useEffect sẽ chạy lại nếu state đổi
            break;
          }
        } else {
          // normal mode
          if (ok) {
            setHasMatched(true);
            toast.success("Tuyệt vời! 🎉");
            break;
          }
        }

        // chờ 1.5s rồi detect frame tiếp theo
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    };

    loop();

    return () => {
      cancelled = true;
    };
  }, [cameraActive, autoMode, emotionIndex, hasMatched]);
  // 👆 khi emotionIndex đổi (auto-mode tiến tới emotion mới) -> loop cũ bị huỷ, loop mới bắt đầu

  // ============ 4. Đồng bộ UI với auto-mode ============
  useEffect(() => {
    if (autoMode) {
      setSelectedEmotion(emotions[emotionIndex]);
    }
  }, [emotionIndex, autoMode]);

  // Tự ẩn overlay "Bạn đã làm đúng!" sau ~2s ở NORMAL MODE
  useEffect(() => {
    if (hasMatched && !autoMode) {
      const timer = setTimeout(() => {
        setHasMatched(false);
      }, 2000); // 2000ms = 2s

      return () => clearTimeout(timer); // dọn timer nếu state thay đổi sớm hơn
    }
  }, [hasMatched, autoMode]);

  const startAutoPractice = () => {
    setEmotionIndex(0);
    setSelectedEmotion(emotions[0]);
    setAutoMode(true);
    setHasMatched(false);
    setMatchPercentage(0);

    if (!cameraActive) startCamera();
    toast("Bắt đầu chế độ luyện tập tự động!");
  };

  // ============ 5. RENDER ============
  return (
    <div className="h-screen overflow-hidden p-3 flex flex-col app-bg">
      <div className="container mx-auto max-w-5xl flex flex-col h-full">
        {/* BACK BUTTON */}
        <Button
          variant="outline"
          onClick={() => navigate("/home")}
          className="mb-3 bg-white/80 border-orange-300 text-gray-800 hover:bg-orange-50"
        >
          <ArrowLeft className="mr-2" size={18} />
          Quay lại
        </Button>

        {/* EMOTION SELECTOR */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {emotions.map((emotion) => (
            <Card
              key={emotion.id}
              onClick={() => {
                setAutoMode(false);
                setSelectedEmotion(emotion);
                setMatchPercentage(0);
                setHasMatched(false);
              }}
              className={`p-3 text-center cursor-pointer transition-all duration-300
                ${selectedEmotion.id === emotion.id ? "ring-4 ring-primary shadow-active" : ""}
              `}
            >
              <div className="text-3xl mb-1">{emotion.emoji}</div>
              <h3 className="text-sm font-bold text-foreground">{emotion.name}</h3>
            </Card>
          ))}
        </div>

        {/* AUTO PRACTICE BUTTON */}
        <Button
          className="mb-3 bg-blue-600 text-white hover:bg-blue-700"
          onClick={startAutoPractice}
        >
          Tập lần lượt
        </Button>

        {/* MAIN CAMERA AREA */}
        <Card className="flex-1 p-6 bg-white/95 shadow-hover flex flex-col min-h-0">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            {selectedEmotion.instruction}
          </h3>

          <div className="bg-muted/50 rounded-2xl flex-1 flex items-center justify-center min-h-0">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="text-center">
                <Camera size={80} className="mx-auto mb-4 text-muted-foreground" />
                <Button
                  onClick={startCamera}
                  size="lg"
                  className="gradient-primary text-gray-900 text-lg px-8 py-6"
                >
                  <Camera className="mr-2" size={24} />
                  Bật camera
                </Button>
              </div>
            )}
          </div>

          {/* 🎉 OVERLAY HOÀN THÀNH NORMAL MODE */}
          {hasMatched && !autoMode && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-xl animate-fadeIn">
              <div className="text-6xl text-green-400 font-bold">✓</div>
              <div className="text-2xl text-white mt-2">Bạn đã làm đúng!</div>
            </div>
          )}

          {/* MATCH PERCENTAGE */}
          {cameraActive && (
            <div className="text-center mt-4">
              <p className="text-xl font-bold">Độ khớp: {matchPercentage}%</p>

              <Button onClick={stopCamera} className="mt-2" variant="outline">
                Tắt camera
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* PANEL ĐỘ KHỚP BÊN PHẢI */}
      <div
        className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 
                   w-64 flex-col gap-3 bg-white/90 rounded-2xl shadow-lg 
                   border border-black/5 p-4 z-20"
      >
        <h4 className="text-sm font-semibold text-gray-700 mb-1">
          Độ khớp hiện tại
        </h4>

        <p className="text-xs text-gray-500">
          Cảm xúc: <span className="font-semibold">{selectedEmotion.name}</span>
        </p>

        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold">{matchPercentage}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden mt-1">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${matchPercentage}%` }}
          />
        </div>

        <p className="text-[11px] text-gray-500 mt-1">
          Hãy làm đúng khuôn mặt{" "}
          <span className="font-semibold">{selectedEmotion.name.toLowerCase()}</span> để
          thanh này đạt ≥ 80%.
        </p>
      </div>
    </div>
  );
};

export default Practice;
