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
      title: "Trắc nghiệm vui 📝",
      description: "Học nhận biết cảm xúc qua quiz",
      icon: <BookOpen size={48} />,
      path: "/quiz",
      gradient: "from-orange-400 to-orange-600",
      emoji: "📝"
    },
    {
      title: "Luyện biểu cảm 🎭",
      description: "Thực hành biểu đạt cảm xúc",
      icon: <Camera size={48} />,
      path: "/practice",
      gradient: "from-blue-400 to-blue-600",
      emoji: "🎭"
    },
    {
      title: "Cấp độ học 🎯",
      description: "Xem các cấp độ và bài học",
      icon: <Trophy size={48} />,
      path: "/levels",
      gradient: "from-yellow-400 to-yellow-600",
      emoji: "🎯"
    },
    {
      title: "Tiến trình 📊",
      description: "Xem kết quả và thành tích",
      icon: <TrendingUp size={48} />,
      path: "/progress",
      gradient: "from-green-400 to-green-600",
      emoji: "📊"
    }
  ];

  return (
    <div className="min-h-screen app-bg p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <div className="flex items-center gap-4">
            <img
              src={mascot}
              alt="Mascot"
              className="w-16 h-16 animate-bounce-gentle"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chào bạn! 👋
              </h1>
              <p className="text-gray-700">
                Hãy chọn hoạt động muốn làm nhé!
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/settings")}
              className="
                bg-white
                border-orange-300
                text-gray-800
                hover:bg-orange-50
              "
            >
              <SettingsIcon className="mr-2" size={24} />
              Cài đặt
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
              className="
                bg-white
                border-orange-300
                text-gray-800
                hover:bg-orange-50
              "
            >
              <LogOut className="mr-2" size={24} />
              Thoát
            </Button>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-2 gap-6 animate-scale-in">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              onClick={() => navigate(item.path)}
              className="p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/95 backdrop-blur"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg animate-bounce-gentle`}>
                  <span className="text-5xl">{item.emoji}</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  {item.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {item.description}
                </p>
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${item.gradient} text-white hover:opacity-90 text-xl px-8 py-6 h-auto`}
                >
                  Bắt đầu →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Fun Message */}
        <div className="mt-8 text-center p-6 bg-white/20 backdrop-blur rounded-2xl">
          <p className="text-2xl font-bold text-orange-700">
            ✨ Hãy vui vẻ học mỗi ngày nhé! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
