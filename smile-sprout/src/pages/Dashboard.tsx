import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Camera, Trophy, TrendingUp, Settings as SettingsIcon, LogOut } from "lucide-react";
import mascot from "@/assets/mascot.png";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const menuItems = [
    {
      title: "Trắc nghiệm vui",
      description: "Học nhận biết cảm xúc qua quiz",
      path: "/quiz",
      gradient: "from-[hsl(250,45%,78%)] to-[hsl(280,35%,82%)]",
      emoji: "📝",
    },
    {
      title: "Luyện biểu cảm",
      description: "Thực hành biểu đạt cảm xúc",
      path: "/practice",
      gradient: "from-[hsl(160,35%,68%)] to-[hsl(180,35%,72%)]",
      emoji: "🎭",
    },
    {
      title: "Cấp độ học",
      description: "Xem các cấp độ và bài học",
      path: "/levels",
      gradient: "from-[hsl(200,50%,72%)] to-[hsl(220,45%,75%)]",
      emoji: "🎯",
    },
    {
      title: "Tiến trình",
      description: "Xem kết quả và thành tích",
      path: "/progress",
      gradient: "from-[hsl(155,35%,62%)] to-[hsl(170,35%,68%)]",
      emoji: "📊",
    },
  ];

  return (
    <div className="min-h-screen app-bg p-4 pb-8">
      <div className="container mx-auto max-w-5xl">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <div className="flex items-center gap-4">
            <img
              src={mascot}
              alt="Mascot"
              className="w-14 h-14 animate-float"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Chào bạn! 👋
              </h1>
              <p className="text-muted-foreground font-semibold">
                Hãy chọn hoạt động muốn làm nhé!
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/settings")}
              className="rounded-xl bg-white/80 border-2 border-border hover:border-primary/30 hover:bg-primary/5 font-bold"
              id="dashboard-settings-btn"
            >
              <SettingsIcon className="mr-1.5" size={20} />
              <span className="hidden sm:inline">Cài đặt</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLogout}
              className="rounded-xl bg-white/80 border-2 border-border hover:border-destructive/30 hover:bg-destructive/5 font-bold"
              id="dashboard-logout-btn"
            >
              <LogOut className="mr-1.5" size={20} />
              <span className="hidden sm:inline">Thoát</span>
            </Button>
          </div>
        </div>

        {/* ── Menu Cards ── */}
        <div className="grid md:grid-cols-2 gap-5 animate-scale-in">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              onClick={() => navigate(item.path)}
              className="p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-hover bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-white/70 group"
              style={{ animationDelay: `${index * 80}ms` }}
              id={`dashboard-card-${index}`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Emoji circle */}
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <span className="text-4xl">{item.emoji}</span>
                </div>

                <h2 className="text-2xl font-extrabold text-foreground">
                  {item.title}
                </h2>
                <p className="text-base text-muted-foreground font-semibold">
                  {item.description}
                </p>

                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${item.gradient} text-white hover:opacity-90 text-lg px-7 py-5 h-auto rounded-2xl font-extrabold shadow-xs`}
                >
                  Bắt đầu →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Encouraging message ── */}
        <div className="mt-8 text-center p-5 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60">
          <p className="text-xl font-extrabold text-primary">
            ✨ Hãy vui vẻ học mỗi ngày nhé! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
