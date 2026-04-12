import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, Target, TrendingUp, Award } from "lucide-react";
import { ProgressCard } from "@/components/ProgressCard";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

const Progress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    // Mô phỏng API call
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Dữ liệu mẫu cho biểu đồ tiến trình theo thời gian
  const progressData = [
    { day: "T2", score: 65, accuracy: 70 },
    { day: "T3", score: 72, accuracy: 75 },
    { day: "T4", score: 78, accuracy: 80 },
    { day: "T5", score: 85, accuracy: 82 },
    { day: "T6", score: 88, accuracy: 85 },
    { day: "T7", score: 92, accuracy: 87 },
    { day: "CN", score: 95, accuracy: 90 },
  ];

  // Dữ liệu mẫu cho biểu đồ độ chính xác theo cảm xúc
  const emotionAccuracy = [
    { emotion: "Vui", accuracy: 95 },
    { emotion: "Buồn", accuracy: 88 },
    { emotion: "Giận", accuracy: 82 },
    { emotion: "Ngạc nhiên", accuracy: 78 },
  ];

  return (
    <div className="min-h-screen p-4 app-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/home")}
            className="mb-6 bg-white/80 border-orange-300 text-gray-800 hover:bg-orange-50"
          >
            <ArrowLeft className="mr-2" size={20} />
            Quay lại
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-gray-900">
              Tiến trình của bạn 🎯
            </h1>
            <p className="text-2xl text-gray-700">
              Hãy xem bạn đã tiến bộ như thế nào!
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-scale-in">
          <ProgressCard
            icon={<Flame size={28} />}
            title="Chuỗi ngày học"
            value="7"
            subtitle="Ngày liên tiếp"
            color="var(--gradient-primary)"
          />
          
          <ProgressCard
            icon={<Target size={28} />}
            title="Bài đã hoàn thành"
            value="24"
            subtitle="Quiz hoàn thành"
            color="var(--gradient-secondary)"
          />
          
          <ProgressCard
            icon={<TrendingUp size={28} />}
            title="Độ chính xác"
            value="87%"
            subtitle="Tỷ lệ đúng"
            color="var(--gradient-success)"
          />
          
          <ProgressCard
            icon={<Award size={28} />}
            title="Thành tích"
            value="12"
            subtitle="Huy chương đạt được"
            color="hsl(48 100% 65%)"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white/95 backdrop-blur shadow-soft">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              📈 Tiến trình 7 ngày
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(38 92% 60%)" 
                  strokeWidth={3}
                  name="Điểm số"
                  dot={{ fill: "hsl(38 92% 60%)", r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(199 89% 48%)" 
                  strokeWidth={3}
                  name="Độ chính xác (%)"
                  dot={{ fill: "hsl(199 89% 48%)", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur shadow-soft">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              🎯 Độ chính xác theo cảm xúc
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={emotionAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="emotion" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar 
                  dataKey="accuracy" 
                  fill="hsl(38 92% 60%)" 
                  name="Độ chính xác (%)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-8 rounded-2xl bg-white/95 backdrop-blur shadow-soft">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              📊 Tiến độ theo cấp độ
            </h3>
            
            <div className="space-y-4">
              {[
                { level: "Cấp độ 1", progress: 100, color: "var(--gradient-success)" },
                { level: "Cấp độ 2", progress: 65, color: "var(--gradient-primary)" },
                { level: "Cấp độ 3", progress: 20, color: "var(--gradient-secondary)" },
                { level: "Cấp độ 4", progress: 0, color: "hsl(var(--muted))" },
              ].map((item) => (
                <div key={item.level}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-foreground">{item.level}</span>
                    <span className="text-muted-foreground">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
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

          <div className="p-8 rounded-2xl bg-white/95 backdrop-blur shadow-soft">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              🏆 Thành tích gần đây
            </h3>
            
            <div className="space-y-4">
              {[
                { icon: "🎯", title: "Hoàn thành 20 quiz", date: "Hôm nay" },
                { icon: "🔥", title: "Chuỗi 7 ngày", date: "Hôm nay" },
                { icon: "⭐", title: "Đạt 90% độ chính xác", date: "Hôm qua" },
                { icon: "🚀", title: "Mở khóa Cấp độ 2", date: "2 ngày trước" },
              ].map((achievement, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-background/50 rounded-lg"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center p-8 rounded-2xl gradient-primary text-gray-900 shadow-soft">
          <h3 className="text-2xl font-bold mb-4">
            Tiếp tục phát huy nhé! 💪
          </h3>
          <p className="text-lg opacity-90 mb-6">
            Bạn đang làm rất tốt! Hãy tiếp tục học mỗi ngày để giữ vững chuỗi ngày học của mình.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/quiz")}
            className="bg-white text-primary hover:bg-white/90"
          >
            Tiếp tục học
          </Button>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
