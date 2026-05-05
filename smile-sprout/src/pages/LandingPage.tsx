import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Camera,
  Heart,
  Shield,
  Star,
  Trophy,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import mascot from "@/assets/mascot.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-landing">
      {/* ── HEADER / NAV ── */}
      <header
        id="landing-header"
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-border/40"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-3">
            <img src={mascot} alt="Smile Sprout mascot" className="w-10 h-10" />
            <span className="text-xl font-extrabold text-foreground tracking-tight">
              Smile Sprout 🌱
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">
              Tính năng
            </a>
            <a href="#method" className="hover:text-primary transition-colors">
              Phương pháp
            </a>
            <a href="#benefits" className="hover:text-primary transition-colors">
              Lợi ích
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="rounded-xl font-bold border-2 border-primary/25 hover:border-primary/50 hover:bg-primary/5"
              id="landing-login-btn"
            >
              Đăng nhập
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              className="rounded-xl font-bold gradient-primary text-white shadow-glow"
              id="landing-register-btn"
            >
              Bắt đầu ngay
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section id="hero" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary font-bold text-sm mb-6">
                <Sparkles size={16} />
                Ứng dụng hỗ trợ trẻ tự kỷ
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Khám phá
                <br />
                <span className="bg-gradient-to-r from-[hsl(250,50%,65%)] to-[hsl(200,55%,62%)] bg-clip-text text-transparent">
                  thế giới cảm xúc
                </span>
                <br />
                cùng bé! 🌟
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Giúp trẻ học nhận biết và biểu đạt cảm xúc một cách vui vẻ,
                tự nhiên qua các hoạt động tương tác sinh động.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="rounded-2xl font-extrabold gradient-primary text-white text-lg px-8 py-6 h-auto shadow-glow hover:shadow-lg transition-all"
                  id="hero-start-btn"
                >
                  <Heart className="mr-2" size={22} />
                  Bắt đầu miễn phí
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-2xl font-bold border-2 text-lg px-8 py-6 h-auto hover:bg-primary/5"
                  id="hero-learn-more-btn"
                >
                  Tìm hiểu thêm
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-success" />
                  Miễn phí 100%
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-accent" />
                  An toàn cho trẻ
                </div>
              </div>
            </div>

            {/* Right: Mascot */}
            <div className="flex justify-center animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-3xl scale-125" />
                <img
                  src={mascot}
                  alt="Mascot vui vẻ"
                  className="relative w-56 h-56 md:w-72 md:h-72 object-contain animate-float drop-shadow-lg"
                />
                {/* Floating emojis */}
                <div className="absolute -top-4 -right-4 text-4xl animate-bounce-gentle" style={{ animationDelay: "0s" }}>😊</div>
                <div className="absolute -bottom-2 -left-6 text-3xl animate-bounce-gentle" style={{ animationDelay: "0.7s" }}>🎉</div>
                <div className="absolute top-1/2 -right-8 text-3xl animate-bounce-gentle" style={{ animationDelay: "1.4s" }}>⭐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Học cảm xúc thật dễ dàng! 🎨
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Các hoạt động được thiết kế đặc biệt cho trẻ tự kỷ, dựa trên nghiên cứu khoa học
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "📝",
                title: "Trắc nghiệm vui",
                desc: "Nhận biết cảm xúc qua hình ảnh, video và âm thanh. Các câu hỏi sinh động, dễ hiểu.",
                gradient: "from-[hsl(250,45%,78%)] to-[hsl(280,35%,80%)]",
              },
              {
                emoji: "🎭",
                title: "Luyện biểu cảm",
                desc: "Thực hành biểu đạt cảm xúc với camera. AI nhận diện và phản hồi tức thì.",
                gradient: "from-[hsl(160,35%,68%)] to-[hsl(180,35%,72%)]",
              },
              {
                emoji: "🏆",
                title: "Tiến bộ rõ ràng",
                desc: "Theo dõi tiến trình, nhận thưởng khi hoàn thành. Động viên và khích lệ từng bước.",
                gradient: "from-[hsl(200,50%,72%)] to-[hsl(220,45%,75%)]",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-white/70 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1 group"
                id={`feature-card-${i}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <span className="text-3xl">{feature.emoji}</span>
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHOD SECTION ── */}
      <section id="method" className="py-16 md:py-20 px-4 bg-white/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Phương pháp khoa học 🔬
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dựa trên nghiên cứu về giáo dục đặc biệt và tâm lý trẻ em
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Brain size={24} className="text-primary" />,
                title: "Học qua hình ảnh trực quan",
                desc: "Trẻ tự kỷ thường học tốt qua thị giác. Ứng dụng sử dụng hình ảnh, video rõ ràng để giúp trẻ nhận biết cảm xúc.",
              },
              {
                icon: <Star size={24} className="text-accent" />,
                title: "Phản hồi tích cực liên tục",
                desc: "Mỗi bước tiến đều được ghi nhận và khen thưởng, tạo động lực cho trẻ tiếp tục học tập.",
              },
              {
                icon: <Users size={24} className="text-secondary" />,
                title: "Tương tác an toàn",
                desc: "Giao diện đơn giản, không quảng cáo, không nội dung gây sao nhãng. An toàn 100% cho trẻ.",
              },
              {
                icon: <Heart size={24} className="text-destructive" />,
                title: "Cá nhân hóa trải nghiệm",
                desc: "Các cấp độ từ dễ đến khó, cho phép trẻ học theo nhịp riêng mà không bị áp lực.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-2xl bg-white/60 border border-white/80 shadow-xs hover:shadow-soft transition-all"
                id={`method-item-${i}`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-background flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS SECTION ── */}
      <section id="benefits" className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Tại sao chọn Smile Sprout? 🌱
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🎯", label: "Nhiều cấp độ", sub: "Từ dễ đến nâng cao" },
              { emoji: "📊", label: "Theo dõi tiến trình", sub: "Biểu đồ chi tiết" },
              { emoji: "🎮", label: "Trò chơi vui", sub: "Học mà chơi" },
              { emoji: "🛡️", label: "An toàn", sub: "Không quảng cáo" },
            ].map((b, i) => (
              <Card
                key={i}
                className="p-5 rounded-2xl text-center bg-white/80 border-2 border-white/70 shadow-xs hover:shadow-soft transition-all hover:-translate-y-1"
                id={`benefit-card-${i}`}
              >
                <div className="text-3xl mb-2">{b.emoji}</div>
                <h4 className="font-extrabold text-foreground text-sm mb-1">{b.label}</h4>
                <p className="text-xs text-muted-foreground">{b.sub}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section id="cta" className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="p-10 md:p-14 rounded-3xl text-center gradient-primary shadow-glow border-0">
            <div className="text-5xl mb-5 animate-bounce-gentle">🌟</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Sẵn sàng khám phá cảm xúc?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Bắt đầu hành trình học tập thú vị cùng bé ngay hôm nay! Hoàn toàn miễn phí.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="rounded-2xl font-extrabold bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 h-auto shadow-lg"
              id="cta-start-btn"
            >
              <Sparkles className="mr-2" size={22} />
              Đăng ký miễn phí
            </Button>
          </Card>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 bg-white/25 border-t border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={mascot} alt="Mascot" className="w-8 h-8" />
              <span className="font-bold text-foreground">Smile Sprout</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Smile Sprout. Ứng dụng hỗ trợ trẻ tự kỷ học cảm xúc.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Phiên bản 1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
