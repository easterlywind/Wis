import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Undo, Palette, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/axios";
import { useSound } from "@/hooks/useSound";

interface EmotionSuggestion {
  id: string;
  name: string;
  iconUrl: string | null;
}

interface DrawingRecord {
  id: string;
  imageUrl: string;
  createdAt: string;
  emotion: {
    name: string;
  };
}

const colors = ["#000000", "#e53e3e", "#38a169", "#3182ce", "#d69e2e", "#805ad5", "#e53e3e"];

const DrawingCanvas = () => {
  const navigate = useNavigate();
  const { playClick, playComplete } = useSound();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [emotions, setEmotions] = useState<EmotionSuggestion[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionSuggestion | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  
  const [viewGallery, setViewGallery] = useState(false);
  const [myDrawings, setMyDrawings] = useState<DrawingRecord[]>([]);

  // Fetch emotions
  useEffect(() => {
    api.get("/drawings/emotions").then((res) => {
      setEmotions(res.data);
      if (res.data.length > 0) {
        setSelectedEmotion(res.data[0]);
      }
    });
  }, []);

  // Fetch gallery
  useEffect(() => {
    if (viewGallery) {
      api.get("/drawings/my").then((res) => {
        setMyDrawings(res.data);
      });
    }
  }, [viewGallery]);

  // Init canvas white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Save initial state
        setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      }
    }
  }, [viewGallery]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    
    // Calculate actual displayed size due to object-fit: contain
    const canvasRatio = canvas.width / canvas.height;
    const rectRatio = rect.width / rect.height;
    
    let actualWidth, actualHeight, offsetX, offsetY;
    if (rectRatio > canvasRatio) {
      actualHeight = rect.height;
      actualWidth = actualHeight * canvasRatio;
      offsetX = (rect.width - actualWidth) / 2;
      offsetY = 0;
    } else {
      actualWidth = rect.width;
      actualHeight = actualWidth / canvasRatio;
      offsetX = 0;
      offsetY = (rect.height - actualHeight) / 2;
    }

    const scaleX = canvas.width / actualWidth;
    const scaleY = canvas.height / actualHeight;
    
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left - offsetX) * scaleX,
      y: (clientY - rect.top - offsetY) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);

    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Save state for undo
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const newHistory = [...history, ctx.getImageData(0, 0, canvas.width, canvas.height)];
        setHistory(newHistory.slice(-10)); // Keep last 10 states
      }
    }
  };

  const undo = () => {
    if (history.length <= 1) return; // Cannot undo initial white background
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const previousState = history[history.length - 2];
        ctx.putImageData(previousState, 0, 0);
        setHistory(history.slice(0, -1));
        playClick();
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
        playClick();
      }
    }
  };

  const saveDrawing = async () => {
    if (!selectedEmotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to base64
    const base64Image = canvas.toDataURL("image/png");

    try {
      await api.post("/drawings/save", {
        emotionId: selectedEmotion.id,
        base64Image,
      });
      playComplete();
      toast.success("Tranh của bạn đã được lưu! 🎨");
      clearCanvas();
    } catch (err) {
      console.error(err);
      toast.error("Không thể lưu tranh. Vui lòng thử lại.");
    }
  };

  if (viewGallery) {
    return (
      <div className="min-h-screen app-bg flex flex-col font-body">
        <header className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { playClick(); setViewGallery(false); }}
              className="rounded-full bg-white/50 hover:bg-white w-12 h-12"
            >
              <ArrowLeft className="w-6 h-6 text-[#2c3152]" />
            </Button>
            <h1 className="text-3xl font-heading font-extrabold text-[#006c53]">Phòng tranh của bé</h1>
          </div>
        </header>

        <main className="flex-1 p-6">
          {myDrawings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-50">🖼️</div>
              <p className="text-xl text-[#64748b] font-bold">Chưa có bức tranh nào. Hãy vẽ tranh đầu tiên nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myDrawings.map((draw) => (
                <Card key={draw.id} className="overflow-hidden clay-card bg-white border-4 border-white group">
                  <div className="aspect-square bg-[#f8f9fa] relative">
                    <img 
                      src={`${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "")}/${draw.imageUrl}`} 
                      alt={draw.emotion.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 bg-[#9cf4d3] text-center border-t-4 border-[#e6e1ea]">
                    <p className="font-heading font-extrabold text-[#006c53]">Chủ đề: {draw.emotion.name}</p>
                    <p className="text-xs text-[#087258] mt-1">
                      {new Date(draw.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg flex flex-col font-body h-screen overflow-hidden">
      <header className="p-4 md:p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/practice")}
            className="rounded-full bg-[#ebe6ef] hover:bg-white w-12 h-12 shadow-md"
          >
            <ArrowLeft className="w-6 h-6 text-[#484552]" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[#006c53] flex items-center gap-2">
            <Palette className="w-8 h-8" />
            Bé tập vẽ
          </h1>
        </div>
        
        <Button 
          onClick={() => { playClick(); setViewGallery(true); }}
          className="rounded-xl bg-[#8fcbe9] hover:bg-[#72b5d8] text-[#1c1b21] font-bold"
        >
          <ImageIcon className="w-5 h-5 mr-2" />
          Phòng tranh
        </Button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 min-h-0">
        {/* Left Side: Instructions & Palette */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          <Card className="p-6 clay-card bg-[#9cf4d3] border-4 border-[#006c53]">
            <h3 className="font-heading font-extrabold text-xl text-[#006c53] mb-4">
              Vẽ khuôn mặt...
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {emotions.map(emo => (
                <button
                  key={emo.id}
                  onClick={() => { playClick(); setSelectedEmotion(emo); }}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    selectedEmotion?.id === emo.id 
                      ? "bg-[#006c53] text-white shadow-lg scale-105" 
                      : "bg-white text-[#006c53] hover:bg-[#e6fcf4]"
                  }`}
                >
                  {emo.name}
                </button>
              ))}
            </div>
            
            {selectedEmotion?.iconUrl && (
              <div className="bg-white rounded-2xl p-4 flex justify-center items-center h-40 border-4 border-[#e6e1ea]">
                <img 
                  src={`${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "")}/${selectedEmotion.iconUrl}`} 
                  alt={selectedEmotion.name}
                  className="max-h-full object-contain drop-shadow-md opacity-50"
                />
              </div>
            )}
          </Card>

          <Card className="p-6 clay-card bg-white border-4 border-[#e6e1ea] flex-1">
            <h3 className="font-heading font-extrabold text-[#2c3152] mb-4 text-lg">Màu sắc</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => { playClick(); setColor(c); }}
                  className={`w-10 h-10 rounded-full shadow-md transition-all ${
                    color === c ? "scale-125 ring-4 ring-offset-2 ring-[#006c53]" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              {/* Eraser */}
              <button
                onClick={() => { playClick(); setColor("#ffffff"); }}
                className={`w-10 h-10 rounded-full shadow-md border-2 border-dashed border-[#cbd5e1] flex items-center justify-center bg-white transition-all ${
                  color === "#ffffff" ? "scale-125 ring-4 ring-offset-2 ring-gray-400" : "hover:scale-110"
                }`}
                title="Cục tẩy"
              >
                <span className="text-xs font-bold text-gray-400">Xóa</span>
              </button>
            </div>

            <h3 className="font-heading font-extrabold text-[#2c3152] mb-4 text-lg">Nét bút</h3>
            <div className="flex items-center gap-4 mb-6">
              {[2, 5, 10, 20].map(w => (
                <button
                  key={w}
                  onClick={() => { playClick(); setLineWidth(w); }}
                  className={`flex items-center justify-center h-10 rounded-xl transition-all flex-1 ${
                    lineWidth === w ? "bg-[#e6e1ea] shadow-inner" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="bg-black rounded-full" style={{ width: w, height: w }} />
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={undo} variant="outline" className="flex-1 rounded-xl font-bold">
                <Undo className="w-4 h-4 mr-2" /> Quay lại
              </Button>
              <Button onClick={clearCanvas} variant="outline" className="flex-1 rounded-xl font-bold text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" /> Xóa sạch
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side: Canvas */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border-8 border-white clay-card overflow-hidden relative cursor-crosshair">
            {/* The canvas needs to be exactly matching the container size. We use standard 800x600 for high quality saving, scaled down via CSS */}
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full object-contain touch-none"
              style={{ touchAction: "none" }}
            />
          </div>
          
          <Button
            onClick={saveDrawing}
            className="absolute bottom-6 right-6 rounded-2xl font-heading font-extrabold text-xl py-6 px-8 bg-[#006c53] hover:bg-[#087258] text-white shadow-[0_8px_0_#004d3b] hover:shadow-[0_4px_0_#004d3b] hover:translate-y-1 transition-all"
          >
            <Save className="w-6 h-6 mr-3" />
            Lưu tranh
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DrawingCanvas;
