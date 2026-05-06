import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Gamepad2, ArrowRight, Palette, Mic } from "lucide-react";
import { toast } from "sonner";

import { api } from "../lib/axios";

const emotions = [
  { id: "happy", dbId: "1", emoji: "😊", name: "Vui vẻ", instruction: "Cười tươi lên nhé! 😊" },
  { id: "sad", dbId: "2", emoji: "😢", name: "Buồn", instruction: "Hơi buồn chút nào... 😢" },
  { id: "angry", dbId: "3", emoji: "😠", name: "Giận", instruction: "Nhíu mày lại nào! 😠" },
  { id: "surprised", dbId: "4", emoji: "😲", name: "Ngạc nhiên", instruction: "Mắt mở to nhé! 😲" },
];

const AI_API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000";

// Weekly Progress sub-component (Phase 2)
const WeeklyProgressCard = () => {
  const [progress, setProgress] = useState({ percentage: 0, completedActivities: 0, totalTarget: 10 });

  useEffect(() => {
    api.get("/game/weekly-progress")
      .then((res: any) => {
        const data = res.data;
        setProgress({
          percentage: data.percentage || 0,
          completedActivities: data.completedActivities || 0,
          totalTarget: data.totalTarget || 10,
        });
      })
      .catch(() => {}); // Silently fail
  }, []);

  const circumference = 2 * Math.PI * 56; // r=56
  const dashoffset = circumference - (progress.percentage / 100) * circumference;

  return (
    <section className="md:col-span-4 clay-card bg-white p-6 rounded-[2rem] border-b-8 border-[#e6e1ea] flex flex-col justify-center h-80">
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle className="text-[#e6e1ea]" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="12" />
            <circle
              className="text-[#5e4caf]"
              cx="64" cy="64" fill="transparent" r="56"
              stroke="currentColor"
              strokeDasharray={circumference.toFixed(1)}
              strokeDashoffset={dashoffset.toFixed(1)}
              strokeWidth="12"
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-heading text-3xl font-extrabold text-[#5e4caf]">
            {progress.percentage}%
          </span>
        </div>
        <h3 className="font-heading text-xl font-extrabold text-[#1c1b21]">Tiến độ tuần</h3>
        <p className="font-body font-semibold text-[#484552]">
          {progress.completedActivities > 0
            ? `Tuyệt vời! Bạn đã hoàn thành ${progress.completedActivities}/${progress.totalTarget} nhiệm vụ.`
            : "Hãy bắt đầu hoạt động đầu tiên nhé!"
          }
        </p>
      </div>
    </section>
  );
};

const Practice = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [showCamera, setShowCamera] = useState(false);
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
  }, [showCamera]); // Stop camera if we unmount or leave camera view

  useEffect(() => {
    if (videoRef.current && stream && showCamera) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, showCamera]);

  // ============ 2. GỬI 1 FRAME LÊN API ============
  const detectOneFrame = async (): Promise<boolean> => {
    if (!videoRef.current || !showCamera) return false;

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

      const isSameLabel = detected === targetId;

      const displayConfidence = isSameLabel
        ? confidence
        : Math.floor(Math.random() * 51);

      if (autoMode) {
        setMatchPercentage(displayConfidence);
      } else {
        if (!hasMatched) {
          setMatchPercentage(displayConfidence);
        }
      }

      const ok = isSameLabel && confidence >= 80;
      return ok;
    } catch (err) {
      console.error("Detection error:", err);
      setMatchPercentage(0);
      return false;
    }
  };

  // ============ 3. VÒNG LẶP ============
  useEffect(() => {
    if (!cameraActive || !showCamera) return;

    let cancelled = false;

    const loop = async () => {
      if (!autoMode && hasMatched) return;

      while (!cancelled && cameraActive) {
        const ok = await detectOneFrame();

        if (autoMode) {
          if (ok) {
            toast.success(`Hoàn thành: ${emotions[emotionIndex].name}! 🎉`);
            
            // Lưu kết quả thực hành vào backend
            try {
              await api.post('/practices/submit', {
                emotionId: emotions[emotionIndex].dbId,
                attemptsCount: 3, 
                correctCount: 1,
                durationMinutes: 1
              });
            } catch (error) {
              console.error("Lỗi khi lưu kết quả thực hành:", error);
            }

            await new Promise((resolve) => setTimeout(resolve, 1200));

            const next = emotionIndex + 1;
            if (next < emotions.length) {
              setEmotionIndex(next);
              setMatchPercentage(0);
            } else {
              toast.success("🎉 Bạn đã hoàn thành tất cả cảm xúc!");
              setAutoMode(false);
            }
            break;
          }
        } else {
          if (ok) {
            setHasMatched(true);
            toast.success("Tuyệt vời! 🎉");
            
            // Lưu kết quả thực hành vào backend
            try {
              await api.post('/practices/submit', {
                emotionId: selectedEmotion.dbId,
                attemptsCount: 3, 
                correctCount: 1,
                durationMinutes: 1
              });
            } catch (error) {
              console.error("Lỗi khi lưu kết quả thực hành:", error);
            }

            break;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    };

    loop();

    return () => {
      cancelled = true;
    };
  }, [cameraActive, autoMode, emotionIndex, hasMatched, showCamera]);

  useEffect(() => {
    if (autoMode) {
      setSelectedEmotion(emotions[emotionIndex]);
    }
  }, [emotionIndex, autoMode]);

  useEffect(() => {
    if (hasMatched && !autoMode) {
      const timer = setTimeout(() => {
        setHasMatched(false);
      }, 2000);
      return () => clearTimeout(timer);
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

  const matchColor =
    matchPercentage >= 80
      ? "hsl(155, 40%, 55%)"
      : matchPercentage >= 50
      ? "hsl(200, 50%, 65%)"
      : "hsl(250, 45%, 70%)";

  if (!showCamera) {
    // Menu View (Hoạt động)
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#2c3152] mb-2">Hoạt động hôm nay</h1>
          <p className="font-body text-lg font-bold text-[#64748b]">Hãy cùng khám phá những điều thú vị mới nhé!</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Hero Activity Card */}
          <section 
            onClick={() => setShowCamera(true)}
            className="md:col-span-8 group cursor-pointer clay-card bg-gradient-to-br from-[#10b981] to-[#0d9488] p-8 rounded-[2rem] border-b-8 border-[#065f46] transition-transform hover:-translate-y-1 relative overflow-hidden h-96 flex flex-col justify-end"
          >
            <div className="absolute top-8 right-8 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform"></div>
            <div className="absolute top-10 right-10 scale-150 transform group-hover:rotate-12 transition-transform">
              <Camera className="text-white w-32 h-32 opacity-80" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/30 backdrop-blur-md px-4 py-1 rounded-full font-body font-bold text-white border border-white/40">Thực hành</span>
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-white mb-2">Gương Cảm Xúc</h2>
              <p className="font-body text-lg text-white/90 max-w-md">Luyện tập các biểu cảm khuôn mặt cùng AI một cách vui nhộn!</p>
            </div>
          </section>

          {/* Small Activity Card: Games */}
          <section 
            onClick={() => navigate("/game/emotion-match")}
            className="md:col-span-4 group cursor-pointer clay-card bg-[#ebe6ef] p-6 rounded-[2rem] border-b-8 border-[#e6e1ea] transition-transform hover:-translate-y-1 flex flex-col justify-between h-96"
          >
            <div className="bg-[#f2df79] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <Gamepad2 className="text-[#1c1b21] w-10 h-10" />
            </div>
            <div>
              <h3 className="font-heading text-2xl font-extrabold text-[#5e4caf] mb-2">Trò chơi</h3>
              <p className="font-body text-[#484552] mb-6 font-semibold">Ghép cảm xúc với tên gọi đúng qua các vòng thử thách.</p>
              <div className="flex items-center gap-2 text-[#5e4caf] font-bold">
                <span>Chơi ngay</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </section>

          {/* Small Activity Card: Creativity */}
          <section className="md:col-span-4 group cursor-pointer clay-card bg-[#9cf4d3] p-6 rounded-[2rem] border-b-8 border-[#006c53] transition-transform hover:-translate-y-1 flex flex-col justify-between h-80 relative">
            <div className="absolute top-4 right-4 bg-[#006c53] text-white text-xs font-heading font-bold px-3 py-1 rounded-full">Sắp có</div>
            <div className="bg-[#8fcbe9] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Palette className="text-[#1c1b21] w-10 h-10" />
            </div>
            <div>
              <h3 className="font-heading text-2xl font-extrabold text-[#006c53] mb-2">Sáng tạo</h3>
              <p className="font-body font-semibold text-[#087258] mb-4">Tô màu, vẽ tranh và tạo nên những tác phẩm nghệ thuật của riêng mình.</p>
            </div>
          </section>

          {/* Small Activity Card: Communication */}
          <section className="md:col-span-4 group cursor-pointer clay-card bg-[#ffe08a] p-6 rounded-[2rem] border-b-8 border-[#745b00] transition-transform hover:-translate-y-1 flex flex-col justify-between h-80 relative">
            <div className="absolute top-4 right-4 bg-[#745b00] text-white text-xs font-heading font-bold px-3 py-1 rounded-full">Sắp có</div>
            <div className="bg-[#ebbb7a] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Mic className="text-[#1c1b21] w-10 h-10" />
            </div>
            <div>
              <h3 className="font-heading text-2xl font-extrabold text-[#745b00] mb-2">Giao tiếp</h3>
              <p className="font-body font-semibold text-[#4e3d00] mb-4">Học cách bày tỏ cảm xúc và kết bạn mới qua các câu chuyện kể.</p>
            </div>
          </section>

          {/* Wide Bottom Card: Weekly Progress */}
          <WeeklyProgressCard />
        </div>
      </div>
    );
  }

  // Camera Practice View
  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden p-4 flex flex-col relative z-10">
      <div className="container mx-auto max-w-5xl flex flex-col h-full">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-4 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowCamera(false)}
            className="rounded-full bg-white/50 hover:bg-white"
          >
            <ArrowLeft className="w-6 h-6 text-[#2c3152]" />
          </Button>
          <h1 className="font-heading text-2xl font-extrabold text-[#2c3152]">Gương Cảm Xúc</h1>
        </div>

        {/* EMOTION SELECTOR */}
        <div className="flex gap-4 overflow-x-auto pb-4 shrink-0 no-scrollbar items-center px-1">
          {emotions.map((emotion) => (
            <Card
              key={emotion.id}
              onClick={() => {
                setAutoMode(false);
                setSelectedEmotion(emotion);
                setMatchPercentage(0);
                setHasMatched(false);
              }}
              className={`p-4 min-w-[120px] text-center cursor-pointer transition-all duration-300 rounded-[1.5rem] border-b-8
                ${selectedEmotion.id === emotion.id
                  ? "bg-[#cabeff] border-[#5e4caf] shadow-[0_4px_12px_rgba(94,76,175,0.2)] -translate-y-1"
                  : "bg-white border-[#e6e1ea] hover:bg-[#fdf8ff] hover:-translate-y-1 clay-card"
                }
              `}
              id={`practice-emotion-${emotion.id}`}
            >
              <div className="text-4xl mb-2 drop-shadow-sm">{emotion.emoji}</div>
              <h3 className="text-base font-heading font-extrabold text-[#2c3152]">{emotion.name}</h3>
            </Card>
          ))}
        </div>

        {/* AUTO PRACTICE BUTTON */}
        <Button
          className="mb-4 rounded-xl font-heading font-extrabold text-lg bg-[#5eb98f] text-white shadow-md hover:bg-[#006c53] h-14"
          onClick={startAutoPractice}
          id="practice-auto-btn"
        >
          🎯 Tập lần lượt
        </Button>

        {/* MAIN CAMERA AREA */}
        <Card className="flex-1 p-6 bg-white shadow-xl rounded-[2.5rem] flex flex-col min-h-0 border-4 border-white relative clay-card">
          <h3 className="text-2xl font-heading font-extrabold text-[#5e4caf] mb-4 text-center">
            {selectedEmotion.instruction}
          </h3>

          <div className="bg-[#f7f2fb] rounded-[2rem] flex-1 flex items-center justify-center min-h-0 overflow-hidden border-4 border-[#e6e1ea] shadow-inner relative">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8">
                <Camera size={80} className="mx-auto mb-6 text-[#c9c4d4]" />
                <Button
                  onClick={startCamera}
                  size="lg"
                  className="rounded-2xl font-heading font-extrabold bg-[#5e4caf] text-white text-xl px-10 py-6 shadow-lg hover:scale-105 transition-transform"
                  id="practice-start-camera-btn"
                >
                  <Camera className="mr-3" size={28} />
                  Bật camera
                </Button>
              </div>
            )}
          </div>

          {/* 🎉 OVERLAY HOÀN THÀNH NORMAL MODE */}
          {hasMatched && !autoMode && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-[2.5rem] animate-scale-in z-20 backdrop-blur-sm">
              <div className="text-8xl mb-6 animate-bounce">✅</div>
              <div className="text-3xl text-white font-heading font-extrabold text-center px-4">Tuyệt vời! Bạn làm đúng rồi!</div>
            </div>
          )}

          {/* MATCH PERCENTAGE */}
          {cameraActive && (
            <div className="text-center mt-6 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl font-heading font-extrabold text-[#64748b]">Độ khớp:</span>
                <span className="text-4xl font-heading font-extrabold" style={{ color: matchColor }}>
                  {matchPercentage}%
                </span>
              </div>

              {/* Match bar */}
              <div className="w-full max-w-lg mx-auto h-6 rounded-full bg-[#e6e1ea] overflow-hidden shadow-inner p-1">
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${matchPercentage}%`, background: matchColor }}
                />
              </div>

              <Button
                onClick={stopCamera}
                variant="outline"
                className="rounded-xl font-heading font-extrabold text-[#e54d68] border-2 border-[#e54d68] hover:bg-[#ffdad6] hover:text-[#93000a] mt-2"
                id="practice-stop-camera-btn"
              >
                Tắt camera
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Practice;
