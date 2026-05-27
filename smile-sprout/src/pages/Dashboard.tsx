import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import { getDataWithRetry } from "@/lib/apiRetry";
import { Trophy, Puzzle, Activity } from "lucide-react";

import learningPathImg from "@/assets/learning_path.png";
import quizImg from "@/assets/quiz.png";
import cameraImg from "@/assets/camera.png";
import progressImg from "@/assets/progress.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    accuracyRate: 0,
    currentLevel: 1,
    streakDays: 0,
    totalPoints: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDataWithRetry(
          () => api.get('/users/me/stats'),
          (d) => d && typeof d.totalPoints === 'number',
          { maxAttempts: 3, initialDelayMs: 400 }
        );
        setStats(data as any);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);


  return (
    <div className="p-6 md:p-8 font-body h-full">
      <div className="max-w-5xl mx-auto pt-4 md:pt-8 md:pl-8">
        {/* Welcome Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#2c3152] mb-2">Trung tâm Khám phá</h1>
          <p className="font-body text-lg font-bold text-[#64748b]">Hôm nay bạn muốn học gì nào?</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[160px]">
          {/* 1. Lộ trình học tập (Hero) */}
          <div 
            onClick={() => navigate("/levels")}
            className="md:col-span-8 md:row-span-3 clay-card bg-gradient-to-br from-[#ebbb7a] to-[#cba734] rounded-[2.5rem] border-b-8 border-[#b4861c] p-8 relative overflow-hidden group cursor-pointer active:translate-y-2 active:border-b-0 transition-all"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full font-bold text-white text-xs tracking-wide uppercase mb-4 inline-block">
                  CHƯƠNG TRÌNH CHÍNH
                </span>
                <h2 className="font-heading text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-sm w-2/3">
                  Lộ trình<br/>học tập
                </h2>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <button className="bg-white text-[#cba734] px-8 py-3 rounded-full font-heading font-extrabold text-lg shadow-lg active:scale-95 transition-all">
                  Tiếp tục
                </button>
                <span className="text-white/90 font-bold bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  Cấp độ {stats.currentLevel}
                </span>
                <span className="text-white/90 font-bold bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm flex items-center gap-1">
                  🔥 {stats.streakDays} Ngày
                </span>
              </div>
            </div>
            
            {/* 3D Illustration */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 opacity-90 transition-transform group-hover:scale-110 duration-500">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc0E7Tk28hyNt4xAwrEu8O81s6tL7dt44O60UV110ISPTvWWsOoK_pSz4IosMeEclRO5gJAgu3ld6LU5drf3kyCA7lpfTlsH8ag_ZsbosoEqv70X8HFzkdRyg06sjaqF-4TIjWuEZJ1Ic04kZZ7b3DAT1SFjywVpL442cPsSHeCVylbjCaQ7yAbLvBWenAFB29iUZKsClDHh2mM03Nok9Kj47VrInj8urKAkzzo3HEff93_EHSB5V2T6gVnER5-537QTRnUXNF10w" alt="3D Sprout" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* 2. Trắc nghiệm nhanh */}
          <div 
            onClick={() => navigate("/quiz")}
            className="md:col-span-4 md:row-span-2 clay-card bg-gradient-to-br from-[#63ba9c] to-[#5eb98f] rounded-[2.5rem] border-b-8 border-[#004e3b] p-8 flex flex-col justify-between group cursor-pointer active:translate-y-2 active:border-b-0 transition-all"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Puzzle className="text-white w-10 h-10" />
            </div>
            <div>
              <h3 className="font-heading text-3xl font-extrabold text-white leading-tight">Trắc nghiệm<br/>nhanh</h3>
              <p className="text-white/80 font-body font-bold text-sm mt-2">Thử thách trí nhớ cùng bạn bè!</p>
            </div>
          </div>

          {/* 3. Góc Hoạt động */}
          <div 
            onClick={() => navigate("/practice")}
            className="md:col-span-4 md:row-span-2 clay-card bg-gradient-to-br from-[#7765c9] to-[#8573d8] rounded-[2.5rem] border-b-8 border-[#413485] p-8 flex flex-col justify-between group cursor-pointer active:translate-y-2 active:border-b-0 transition-all"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Activity className="text-white w-10 h-10" />
            </div>
            <div>
              <h3 className="font-heading text-3xl font-extrabold text-white leading-tight">Góc<br/>Hoạt động</h3>
              <p className="text-white/80 font-body font-bold text-sm mt-2">Vẽ tranh, trò chơi và tập luyện!</p>
            </div>
          </div>

          {/* 4. Tiến trình */}
          <div className="md:col-span-8 md:row-span-1 clay-card bg-white rounded-[2.5rem] border-b-8 border-[#ebe6ef] p-6 flex items-center gap-8 active:translate-y-1 active:border-b-4 transition-all cursor-pointer group">
            <div className="flex-grow">
              <div className="flex justify-between items-end mb-2">
                <h3 className="font-heading text-2xl font-extrabold text-[#5e4caf]">Tiến trình chính xác</h3>
                <span className="font-bold text-[#5eb98f] text-lg">{stats.accuracyRate}%</span>
              </div>
              <div className="w-full h-6 bg-[#ebe6ef] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                <div className="h-full bg-[#5eb98f] rounded-full shadow-[inset_0_-4px_4px_rgba(0,0,0,0.2)]" style={{ width: `${stats.accuracyRate}%` }}></div>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-center justify-center bg-[#f2df79]/30 p-4 rounded-3xl border-2 border-[#f2df79]">
              <Trophy className="text-[#745b00] w-8 h-8 mb-1" />
              <span className="text-xs font-black text-[#745b00]">Cấp {stats.currentLevel}</span>
            </div>
          </div>

          {/* Emotion Chips */}
          <div className="md:col-span-4 md:row-span-1 flex flex-wrap gap-3 items-center justify-center bg-[#f1ecf5] rounded-[2.5rem] p-4 border-b-8 border-[#ebe6ef]">
            <span className="px-5 py-2.5 bg-[#f2df79] text-[#745b00] rounded-full font-bold shadow-sm cursor-pointer hover:bg-opacity-80 active:scale-95 transition-all">Vui vẻ</span>
            <span className="px-5 py-2.5 bg-[#90a7da] text-white rounded-full font-bold shadow-sm cursor-pointer hover:bg-opacity-80 active:scale-95 transition-all">Buồn</span>
            <span className="px-5 py-2.5 bg-[#ebbb7a] text-white rounded-full font-bold shadow-sm cursor-pointer hover:bg-opacity-80 active:scale-95 transition-all">Hào hứng</span>
            <span className="px-5 py-2.5 bg-[#b48fd3] text-white rounded-full font-bold shadow-sm cursor-pointer hover:bg-opacity-80 active:scale-95 transition-all">Lo sợ</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
