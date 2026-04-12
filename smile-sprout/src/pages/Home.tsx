import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, Trophy, User } from "lucide-react";
import mascot from "@/assets/mascot.png";
import heroBanner from "@/assets/hero-banner.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-scale-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Khám phá thế giới cảm xúc! 🌟
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Hãy cùng bạn nhỏ tròn cam học cách nhận biết và biểu đạt cảm xúc một cách vui vẻ và tự nhiên nhé!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/quiz")}
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-active"
                >
                  <BookOpen className="mr-2" size={24} />
                  Bắt đầu học
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-6 h-auto"
                >
                  <User className="mr-2" size={24} />
                  Đăng nhập
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={mascot} 
                alt="Mascot" 
                className="w-64 h-64 object-contain animate-float drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            Học cảm xúc thật dễ dàng!
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Với các hoạt động vui nhộn và sinh động
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl gradient-card shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
                <BookOpen size={40} className="text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Trắc nghiệm vui</h3>
              <p className="text-muted-foreground">
                Nhận biết cảm xúc qua hình ảnh, video và âm thanh sinh động
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl gradient-card shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-secondary flex items-center justify-center">
                <Brain size={40} className="text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Luyện biểu cảm</h3>
              <p className="text-muted-foreground">
                Thực hành biểu đạt cảm xúc với camera và nhận phản hồi ngay lập tức
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl gradient-card shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-success flex items-center justify-center">
                <Trophy size={40} className="text-success-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Tiến bộ rõ ràng</h3>
              <p className="text-muted-foreground">
                Theo dõi tiến trình học tập và nhận thưởng khi hoàn thành mục tiêu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Sẵn sàng khám phá cảm xúc chưa? 🎉
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Hãy bắt đầu hành trình học tập thú vị ngay hôm nay!
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/levels")}
              className="bg-white text-secondary hover:bg-white/90 text-lg px-10 py-6 h-auto shadow-active"
            >
              Xem các cấp độ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
