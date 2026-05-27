import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Sparkles, Medal, Award, Star, Trophy, Lock } from "lucide-react";

interface OverviewStats {
  totalPoints: number;
  streakDays: number;
  accuracyRate: number;
  currentLevel: number;
  totalQuizzes: number;
  excellentQuizzes: number;
}

interface EmotionStat {
  emotion: string;
  totalQuestions: number;
  accuracy: number;
}

interface HistoryDay {
  date: string;
  day: string;
  quizzes: number;
  accuracy: number;
}

interface RecentActivity {
  type: string;
  title: string;
  score: number;
  date: string;
}

import { getStoredUser } from "@/lib/auth-session";

const Progress = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionStat[]>([]);
  const [historyData, setHistoryData] = useState<HistoryDay[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const [statsRes, emotionsRes, historyRes] = await Promise.all([
          api.get("/users/me/stats"),
          api.get("/users/me/stats/emotions"),
          api.get("/users/me/stats/history"),
        ]);

        setStats(statsRes.data);
        setEmotionData(emotionsRes.data);
        
        // Reverse history so it goes from oldest to newest
        setHistoryData(historyRes.data.dailyProgress.reverse());
        setRecentActivities(historyRes.data.recentActivities);
      } catch (err) {
        console.error("Failed to load progress data", err);
        toast.error("Không thể tải dữ liệu tiến trình. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-5xl animate-bounce-gentle">📊</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#5e4caf] mb-2">Hồ sơ</h1>
          <p className="font-body text-lg font-bold text-[#484552]">Chào mừng quay trở lại, nhà thám hiểm tài ba!</p>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Profile Card */}
        <section className="md:col-span-8 bg-[#7765c9] text-white p-8 rounded-[2rem] clay-card border-b-[8px] border-[#5e4caf] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 scale-150 rotate-12">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <img 
                alt="Explorer Profile Avatar" 
                className="w-40 h-40 rounded-3xl border-8 border-white shadow-xl object-cover bg-white" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkOvDukL1OAItad6jZvsdF99rpx1wid52IqPykcxFiTCyPZcwVo71fu_JrZWOmC2F8LJ7mU4uikKT3Ed8H-VrE7sGREu_9BbDNAtY4k5NUsfVJ6i2fgXpL9Jii_oK9V1TvWsS5amc6zSSfRgixmCv98mM73pKRvNOQMVzbC5Hsiq0UBEDpIsdjon-eK9JfeLClvUmCzT7zB6-FYjs6yv2496JYc-2CkcjCA5Bmo_in9VKZQ0g-bcvtC-ADmkxV3DVNeoYJHZCrALo"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#ffe08a] text-[#745b00] font-heading font-extrabold text-xl px-4 py-2 rounded-xl border-b-4 border-[#e9c34d] rotate-6 shadow-md">
                LV {stats.currentLevel}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-heading text-4xl font-extrabold mb-2">{user?.name || "Nhà thám hiểm"}</h2>
              <p className="font-heading text-lg font-bold bg-white/20 inline-block px-4 py-1 rounded-full mb-4">Nhà thám hiểm tài ba</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-[#f2df79] text-[#4e3d00] px-4 py-1 rounded-full font-body font-bold shadow-inner">Vui vẻ</span>
                <span className="bg-[#ebbb7a] text-[#4e3d00] px-4 py-1 rounded-full font-body font-bold shadow-inner">Năng động</span>
                <span className="bg-[#9cf4d3] text-[#00513e] px-4 py-1 rounded-full font-body font-bold shadow-inner">Tò mò</span>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement Card */}
        <section className="md:col-span-4 bg-white p-8 rounded-[2rem] clay-card border-b-[8px] border-[#e6e1ea]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-2xl font-extrabold text-[#5e4caf]">Thành tựu</h3>
            <Medal className="text-[#cba734] w-8 h-8" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-[#f7f2fb] rounded-2xl shadow-inner group hover:scale-105 transition-transform">
              <Award className="text-[#e9c34d] w-10 h-10 mb-2" />
              <span className="font-body text-sm font-bold text-center text-[#484552]">Chuỗi {stats.streakDays} ngày</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-[#f7f2fb] rounded-2xl shadow-inner group hover:scale-105 transition-transform">
              <Star className="text-[#e9c34d] fill-[#e9c34d] w-10 h-10 mb-2" />
              <span className="font-body text-sm font-bold text-center text-[#484552]">Chăm chỉ</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-[#f7f2fb] rounded-2xl shadow-inner group hover:scale-105 transition-transform">
              <Trophy className="text-[#e9c34d] w-10 h-10 mb-2" />
              <span className="font-body text-sm font-bold text-center text-[#484552]">Xuất sắc {stats.excellentQuizzes}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-[#f7f2fb] rounded-2xl shadow-inner group hover:scale-105 transition-transform opacity-60 grayscale">
              <Lock className="text-[#797583] w-10 h-10 mb-2" />
              <span className="font-body text-sm font-bold text-center text-[#797583]">Chưa mở</span>
            </div>
          </div>
        </section>

        {/* Weekly Stats Card */}
        <section className="md:col-span-5 bg-[#9cf4d3] text-[#087258] p-8 rounded-[2rem] clay-card border-b-[8px] border-[#006c53]">
          <h3 className="font-heading text-2xl font-extrabold mb-6 text-[#006c53]">Thống kê học tập</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-body font-bold text-lg text-[#087258]">Điểm kinh nghiệm</span>
                <span className="font-heading font-extrabold text-xl text-[#006c53]">{stats.totalPoints} XP</span>
              </div>
              <div className="w-full h-6 bg-white/40 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-[#006c53] rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((stats.totalPoints % 1000) / 10, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/30 p-4 rounded-2xl shadow-inner text-center">
                <p className="text-3xl font-heading font-extrabold text-[#006c53]">{stats.totalQuizzes}</p>
                <p className="font-body font-bold text-sm mt-1">Bài học xong</p>
              </div>
              <div className="bg-white/30 p-4 rounded-2xl shadow-inner text-center">
                <p className="text-3xl font-heading font-extrabold text-[#006c53]">{stats.accuracyRate}%</p>
                <p className="font-body font-bold text-sm mt-1">Độ chính xác</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activities Card */}
        <section className="md:col-span-7 bg-white p-8 rounded-[2rem] clay-card border-b-[8px] border-[#e6e1ea]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-2xl font-extrabold text-[#5e4caf]">Hoạt động gần đây</h3>
            <span className="font-body font-bold text-lg text-[#797583]">{recentActivities.length} mục</span>
          </div>
          <div className="flex flex-col gap-3">
            {recentActivities.slice(0, 3).map((activity, index) => {
              const dateObj = new Date(activity.date);
              const isToday = dateObj.toDateString() === new Date().toDateString();
              const dateStr = isToday ? "Hôm nay" : dateObj.toLocaleDateString('vi-VN');
              
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-[#f7f2fb] rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <span className="text-2xl">{activity.score >= 80 ? "⭐" : "🎯"}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-extrabold text-[#1c1b21]">{activity.title}</p>
                    <p className="font-body font-semibold text-sm text-[#484552]">{dateStr}</p>
                  </div>
                  <div className="font-heading font-extrabold text-[#5e4caf] bg-[#e6deff] px-3 py-1 rounded-lg">
                    {activity.score} đ
                  </div>
                </div>
              );
            })}
            
            {recentActivities.length === 0 && (
              <div className="text-center py-8">
                <p className="font-body font-bold text-[#797583]">Chưa có hoạt động nào gần đây</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Progress;
