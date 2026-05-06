import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, Target, TrendingUp, Award } from "lucide-react";
import { ProgressCard } from "@/components/ProgressCard";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

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

const Progress = () => {
  const navigate = useNavigate();
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
        
        // Reverse history so it goes from oldest to newest for the chart (left to right)
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

  return (
    <div className="min-h-screen p-4 app-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/home")}
            className="mb-6 rounded-xl font-bold border-2 bg-white/80"
            id="progress-back-btn"
          >
            <ArrowLeft className="mr-2" size={18} />
            Quay lại
          </Button>
          
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎯</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-foreground">
              Tiến trình của bạn
            </h1>
            <p className="text-lg text-muted-foreground font-semibold">
              Hãy xem bạn đã tiến bộ như thế nào!
            </p>
          </div>
        </div>

        {loading || !stats ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-bounce-gentle">📊</div>
            <p className="text-lg font-bold text-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-scale-in">
              <ProgressCard
                icon={<Flame size={24} />}
                title="Chuỗi ngày học"
                value={stats.streakDays.toString()}
                subtitle="Ngày liên tiếp 🔥"
                color="var(--gradient-primary)"
              />
              <ProgressCard
                icon={<Target size={24} />}
                title="Bài đã hoàn thành"
                value={stats.totalQuizzes.toString()}
                subtitle="Quiz hoàn thành ✅"
                color="var(--gradient-secondary)"
              />
              <ProgressCard
                icon={<TrendingUp size={24} />}
                title="Độ chính xác"
                value={`${stats.accuracyRate}%`}
                subtitle="Tỷ lệ đúng 📈"
                color="var(--gradient-success)"
              />
              <ProgressCard
                icon={<Award size={24} />}
                title="Thành tích"
                value={stats.excellentQuizzes.toString()}
                subtitle="Quiz xuất sắc 🏅"
                color="hsl(200 50% 72%)"
              />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-soft rounded-2xl border-2 border-white/60">
                <h3 className="text-xl font-extrabold mb-4 text-foreground">
                  📈 Tiến trình 7 ngày qua
                </h3>
                {historyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 90%)" />
                      <XAxis dataKey="day" stroke="hsl(230, 25%, 25%)" fontSize={13} fontWeight={600} />
                      <YAxis stroke="hsl(230, 25%, 25%)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "2px solid hsl(220, 18%, 90%)",
                          borderRadius: "12px",
                          fontWeight: 600,
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="quizzes" 
                        stroke="hsl(250, 45%, 65%)" 
                        strokeWidth={3}
                        name="Số Quiz"
                        dot={{ fill: "hsl(250, 45%, 65%)", r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="hsl(160, 35%, 55%)" 
                        strokeWidth={3}
                        name="Độ chính xác (%)"
                        dot={{ fill: "hsl(160, 35%, 55%)", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[220px] text-muted-foreground font-semibold">
                    Chưa có dữ liệu học tập
                  </div>
                )}
              </Card>

              <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-soft rounded-2xl border-2 border-white/60">
                <h3 className="text-xl font-extrabold mb-4 text-foreground">
                  🎯 Độ chính xác theo cảm xúc
                </h3>
                {emotionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={emotionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 90%)" />
                      <XAxis dataKey="emotion" stroke="hsl(230, 25%, 25%)" fontSize={12} fontWeight={600} />
                      <YAxis stroke="hsl(230, 25%, 25%)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "2px solid hsl(220, 18%, 90%)",
                          borderRadius: "12px",
                          fontWeight: 600,
                        }} 
                      />
                      <Bar 
                        dataKey="accuracy" 
                        fill="hsl(250, 45%, 75%)" 
                        name="Độ chính xác (%)"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[220px] text-muted-foreground font-semibold">
                    Hãy làm thêm bài tập để xem phân tích nhé!
                  </div>
                )}
              </Card>
            </div>

            {/* Level progress & achievements */}
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-soft border-2 border-white/60">
                <h3 className="text-xl font-extrabold mb-5 text-foreground">
                  📊 Tiến độ theo cấp độ
                </h3>
                
                <div className="space-y-4">
                  {[
                    { level: "Cấp độ 1", progress: stats.currentLevel >= 1 ? 100 : 0, color: "var(--gradient-success)" },
                    { level: "Cấp độ 2", progress: stats.currentLevel > 2 ? 100 : (stats.currentLevel === 2 ? 50 : 0), color: "var(--gradient-primary)" },
                    { level: "Cấp độ 3", progress: stats.currentLevel > 3 ? 100 : (stats.currentLevel === 3 ? 50 : 0), color: "var(--gradient-secondary)" },
                    { level: "Cấp độ 4", progress: stats.currentLevel > 4 ? 100 : (stats.currentLevel === 4 ? 50 : 0), color: "hsl(var(--muted))" },
                  ].map((item) => (
                    <div key={item.level}>
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-foreground text-sm">{item.level}</span>
                        <span className="text-muted-foreground font-bold text-sm">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-700"
                          style={{ 
                            width: `${item.progress}%`,
                            background: item.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-soft border-2 border-white/60">
                <h3 className="text-xl font-extrabold mb-5 text-foreground">
                  🏆 Hoạt động gần đây
                </h3>
                
                <div className="space-y-3">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => {
                      const dateObj = new Date(activity.date);
                      const isToday = dateObj.toDateString() === new Date().toDateString();
                      const dateStr = isToday ? "Hôm nay" : dateObj.toLocaleDateString('vi-VN');
                      
                      return (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 bg-background/50 rounded-xl"
                        >
                          <div className="text-2xl">
                            {activity.score >= 80 ? "⭐" : "🎯"}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-foreground text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground font-semibold">
                              {dateStr} • Điểm: {activity.score}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-muted-foreground font-semibold">
                      Chưa có hoạt động nào gần đây
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center p-8 rounded-2xl gradient-primary shadow-glow">
              <h3 className="text-2xl font-extrabold mb-3 text-white">
                Tiếp tục phát huy nhé! 💪
              </h3>
              <p className="text-lg text-white/80 mb-5 font-semibold">
                Bạn đang làm rất tốt! Hãy tiếp tục học mỗi ngày!
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/quiz")}
                className="rounded-2xl font-extrabold bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-5 h-auto"
                id="progress-continue-btn"
              >
                Tiếp tục học →
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
