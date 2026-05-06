import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Level } from "../types/level";
import { api } from "../lib/axios";
import { toast } from "sonner";
import { getDataWithRetry } from "@/lib/apiRetry";
import { Button } from "@/components/ui/button";

const Levels = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDataWithRetry<Level[]>(
          () => api.get<Level[]>('/levels'),
          (d) => Array.isArray(d) && d.length > 0,
          { maxAttempts: 6, initialDelayMs: 400 }
        );
        setLevels(data);
      } catch (err: any) {
        console.error("Levels fetch error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Lỗi tải level";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  const handleStartLevel = (level: Level) => {
    if (!level.unlocked) {
      toast.error("Cấp độ này đang khóa 🔒");
      return;
    }
    toast.success(`Bắt đầu ${level.name}! 🚀`);
    navigate(`/levels/${level.id}`);
  };

  const getAlignmentClass = (index: number) => {
    if (index === 0) return "justify-center";
    if (index % 2 !== 0) return "justify-end pr-8 md:pr-32";
    return "justify-start pl-8 md:pl-32";
  };

  return (
    <div className="p-6 md:p-8 font-body min-h-screen relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-[#2c3152] mb-2">Lộ trình học tập</h2>
            <p className="font-body text-lg font-bold text-[#64748b]">Chinh phục các hòn đảo cảm xúc kỳ diệu!</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#e6e1ea] p-4 rounded-xl clay-card flex items-center gap-3">
              <span className="material-symbols-outlined text-[#f2df79]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="font-heading text-xl font-extrabold text-[#5e4caf]">1,250</span>
            </div>
          </div>
        </header>

        {loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-bounce">🗺️</div>
            <p className="text-xl font-bold text-[#2c3152]">Đang mở bản đồ...</p>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto p-6 bg-white/80 rounded-[2rem] border-4 border-white text-center shadow-sm">
            <div className="text-4xl mb-3">😔</div>
            <h2 className="text-xl font-extrabold mb-2 text-[#2c3152]">Không tải được bản đồ</h2>
            <p className="text-[#64748b] mb-6">{error}</p>
            <Button
              onClick={() => navigate("/home")}
              className="rounded-2xl font-bold bg-[#5e4caf] text-white"
            >
              ← Quay lại
            </Button>
          </div>
        )}

        {!loading && !error && levels.length > 0 && (
          <div className="relative max-w-4xl mx-auto py-20">
            {/* SVG Winding Path Background */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              <svg className="w-full h-full" fill="none" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
                <path d="M400 50C400 50 100 200 100 400C100 600 700 700 700 900C700 1100 400 1150 400 1150" stroke="#cbd5e1" strokeDasharray="24 32" strokeLinecap="round" strokeWidth="12"></path>
              </svg>
            </div>

            {/* Island Levels Cluster */}
            <div className="relative z-10 flex flex-col items-center gap-48">
              {levels.map((level, index) => {
                const isLocked = !level.unlocked;
                const alignmentClass = getAlignmentClass(index);

                if (!isLocked) {
                  return (
                    <div key={level.id} className={`relative group w-full flex ${alignmentClass}`}>
                      {index === 0 && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#5eb98f] text-white px-6 py-2 rounded-full font-heading font-bold shadow-md animate-bounce z-20">
                          Bắt đầu!
                        </div>
                      )}
                      <button 
                        onClick={() => handleStartLevel(level)}
                        className="w-64 h-64 md:w-80 md:h-80 bg-[#9cf4d3] rounded-full border-b-[12px] border-[#006c53] flex flex-col items-center justify-center p-8 clay-card transition-all hover:scale-110 active:translate-y-2 active:shadow-inner"
                      >
                        <img className="w-32 h-32 mb-4 drop-shadow-lg" alt="Sprout Icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvZoeNtxvOjg60HhXVoLWUXEvYSv-ObUPX5PUF5IB46Cgx6guDLY4eL42lJupNkKblkfpnjSBdR0Xm7a820aVHnOEewfaf6cBZPNav7K0xoZx3IuH9mX928sSpntdL7r59s-g1SsdVNVnSH7ImdpYbNktEB-Q-WZT2Rzo3zi1-NV76qEhqr-aD-84dGKsFH8fHbLImHE_TsI1V2aKV3KNtOUri6woydEqKWUsoUzxsTVrxYDcsaxKE4H3NYXNEXqy7yYVScX5XB2s" />
                        <span className="font-heading text-3xl font-extrabold text-[#087258] text-center px-4 leading-tight">{level.name}</span>
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div key={level.id} className={`relative w-full flex ${alignmentClass}`}>
                      <div className="relative">
                        <button 
                          onClick={() => handleStartLevel(level)}
                          className="w-56 h-56 md:w-72 md:h-72 bg-[#ddd8e1] rounded-full border-b-[12px] border-[#c9c4d4] flex flex-col items-center justify-center p-8 opacity-90 cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-6xl text-[#797583] mb-4">lock</span>
                          <span className="font-heading text-2xl font-bold text-[#797583] text-center px-4 leading-tight">{level.name}</span>
                        </button>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#e6e1ea] px-4 py-1 rounded-lg border border-[#c9c4d4] text-[#797583] font-body font-bold text-sm whitespace-nowrap">
                          Đang bị khoá
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}

        {!loading && !error && levels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg text-[#64748b] font-bold">Chưa có hòn đảo nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Levels;
