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
                  onClick={() => navigate("/quiz")}
                  className="clay-btn bg-white text-primary text-xl px-8 py-6 h-auto"
                >
                  <BookOpen className="mr-2" size={26} />
                  Bắt đầu học
                </Button>
                <Button 
                  onClick={() => navigate("/auth")}
                  className="clay-btn bg-transparent border-2 border-white/40 text-white text-xl px-8 py-6 h-auto"
                >
                  <User className="mr-2" size={26} />
                  Đăng nhập
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={mascot} 
                alt="Mascot" 
                className="w-64 h-64 object-contain animate-float drop-shadow-2xl hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background relative z-10 -mt-8 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-foreground drop-shadow-sm">
            Học cảm xúc thật vui!
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-xl font-medium">
            Với các hoạt động thú vị và sinh động
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 clay-card group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={48} className="text-primary-foreground drop-shadow-md" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Trắc nghiệm vui</h3>
              <p className="text-muted-foreground font-medium text-lg">
                Nhận biết cảm xúc qua hình ảnh, video và âm thanh sinh động
              </p>
            </div>

            <div className="text-center p-8 clay-card group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-secondary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Brain size={48} className="text-secondary-foreground drop-shadow-md" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Luyện biểu cảm</h3>
              <p className="text-muted-foreground font-medium text-lg">
                Thực hành biểu đạt cảm xúc với camera và nhận phản hồi ngay lập tức
              </p>
            </div>

            <div className="text-center p-8 clay-card group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-success flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Trophy size={48} className="text-success-foreground drop-shadow-md" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Tiến bộ rõ ràng</h3>
              <p className="text-muted-foreground font-medium text-lg">
                Theo dõi tiến trình học tập và nhận thưởng khi hoàn thành mục tiêu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-secondary text-secondary-foreground relative z-0">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-sm">
              Sẵn sàng khám phá cảm xúc chưa? 🎉
            </h2>
            <p className="text-2xl mb-10 opacity-90 font-medium">
              Hãy bắt đầu hành trình học tập thú vị ngay hôm nay!
            </p>
            <Button 
              onClick={() => navigate("/levels")}
              className="clay-btn bg-white text-secondary text-xl px-10 py-6 h-auto"
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
