import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";

const emotions = [
  { id: "happy", emoji: "😊", name: "Vui vẻ", instruction: "Cười tươi lên nhé! 😊" },
  { id: "sad", emoji: "😢", name: "Buồn", instruction: "Hơi buồn chút nào... 😢" },
  { id: "angry", emoji: "😠", name: "Giận", instruction: "Nhíu mày lại nào! 😠" },
  { id: "surprised", emoji: "😲", name: "Ngạc nhiên", instruction: "Mắt mở to nhé! 😲" },
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
      toast.success("Camera đã bật! 📸");
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
    toast("Bắt đầu chế độ luyện tập tự động! 🎯");
  };

  // Color for match bar
  const matchColor =
    matchPercentage >= 80
      ? "hsl(155, 40%, 55%)"
      : matchPercentage >= 50
      ? "hsl(200, 50%, 65%)"
      : "hsl(250, 45%, 70%)";

  // ============ 5. RENDER ============
  return (
    <div className="h-screen overflow-hidden p-3 flex flex-col app-bg">
      <div className="container mx-auto max-w-5xl flex flex-col h-full">
        {/* BACK BUTTON */}
        <Button
          variant="outline"
          onClick={() => navigate("/home")}
          className="mb-3 rounded-xl font-bold border-2 bg-white/80"
          id="practice-back-btn"
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
              className={`p-3 text-center cursor-pointer transition-all duration-300 rounded-2xl border-2
                ${selectedEmotion.id === emotion.id
                  ? "ring-2 ring-primary shadow-glow border-primary/40 bg-primary/5"
                  : "bg-white/80 border-white/60 hover:border-primary/20"
                }
              `}
              id={`practice-emotion-${emotion.id}`}
            >
              <div className="text-3xl mb-1">{emotion.emoji}</div>
              <h3 className="text-sm font-extrabold text-foreground">{emotion.name}</h3>
            </Card>
          ))}
        </div>

        {/* AUTO PRACTICE BUTTON */}
        <Button
          className="mb-3 rounded-xl font-bold gradient-secondary text-white shadow-sm"
          onClick={startAutoPractice}
          id="practice-auto-btn"
        >
          🎯 Tập lần lượt
        </Button>

        {/* MAIN CAMERA AREA */}
        <Card className="flex-1 p-5 bg-white/90 shadow-soft rounded-3xl flex flex-col min-h-0 border-2 border-white/60 relative">
          <h3 className="text-lg font-extrabold text-foreground mb-3">
            {selectedEmotion.instruction}
          </h3>

          <div className="bg-muted/30 rounded-2xl flex-1 flex items-center justify-center min-h-0 overflow-hidden">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="text-center p-8">
                <Camera size={64} className="mx-auto mb-4 text-muted-foreground" />
                <Button
                  onClick={startCamera}
                  size="lg"
                  className="rounded-2xl font-extrabold gradient-primary text-white text-lg px-8 py-5 shadow-glow"
                  id="practice-start-camera-btn"
                >
                  <Camera className="mr-2" size={22} />
                  Bật camera
                </Button>
              </div>
            )}
          </div>

          {/* 🎉 OVERLAY HOÀN THÀNH NORMAL MODE */}
          {hasMatched && !autoMode && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-3xl animate-scale-in">
              <div className="text-7xl mb-3">✅</div>
              <div className="text-2xl text-white font-extrabold">Tuyệt vời! Bạn làm đúng rồi!</div>
            </div>
          )}

          {/* MATCH PERCENTAGE */}
          {cameraActive && (
            <div className="text-center mt-4 space-y-3">
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-bold text-foreground">Độ khớp:</span>
                <span className="text-2xl font-extrabold" style={{ color: matchColor }}>
                  {matchPercentage}%
                </span>
              </div>

              {/* Match bar */}
              <div className="w-full max-w-md mx-auto h-4 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${matchPercentage}%`, background: matchColor }}
                />
              </div>

              <Button
                onClick={stopCamera}
                variant="outline"
                className="rounded-xl font-bold border-2"
                id="practice-stop-camera-btn"
              >
                Tắt camera
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* PANEL ĐỘ KHỚP BÊN PHẢI (desktop only) */}
      <div
        className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 
                   w-56 flex-col gap-3 bg-white/90 rounded-2xl shadow-soft 
                   border-2 border-white/60 p-4 z-20"
      >
        <h4 className="text-sm font-extrabold text-foreground mb-1">
          Độ khớp hiện tại
        </h4>

        <p className="text-xs text-muted-foreground font-semibold">
          Cảm xúc: <span className="text-foreground">{selectedEmotion.name} {selectedEmotion.emoji}</span>
        </p>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold" style={{ color: matchColor }}>
            {matchPercentage}%
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${matchPercentage}%`, background: matchColor }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          Hãy làm khuôn mặt{" "}
          <span className="font-bold">{selectedEmotion.name.toLowerCase()}</span> để đạt ≥ 80%.
        </p>
      </div>
    </div>
  );
};

export default Practice;
