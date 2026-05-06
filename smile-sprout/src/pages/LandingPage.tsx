import { Link } from "react-router-dom";
import mascot from "@/assets/mascot.png";
import { Puzzle, ShieldCheck, Smile, BookOpen, Leaf, Frown, Angry, PartyPopper, Sparkles, Ban, Brain, WifiOff, Users, Star, Share2, Mail } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen overflow-x-hidden app-bg">
      <style>{`
        .clay-card {
            box-shadow: 
                0 10px 20px -5px rgba(0, 0, 0, 0.1),
                inset 0 4px 6px -2px rgba(255, 255, 255, 0.8),
                inset 0 -4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .clay-button-primary {
            box-shadow: 0 8px 0 0 #493598;
        }
        .clay-button-primary:active {
            box-shadow: 0 0px 0 0 #493598;
            transform: translateY(8px);
        }
        .clay-button-secondary {
            box-shadow: 0 8px 0 0 #c9c4d4;
        }
        .clay-button-secondary:active {
            box-shadow: 0 0px 0 0 #c9c4d4;
            transform: translateY(8px);
        }
        .font-display-lg { font-family: 'Fredoka', sans-serif; font-size: 3rem; line-height: 1.1; letter-spacing: -0.025em; font-weight: 800; }
        .text-display-lg { font-size: 3rem; line-height: 1.1; letter-spacing: -0.025em; font-weight: 800; }
        .font-headline-lg { font-family: 'Fredoka', sans-serif; font-size: 2.25rem; line-height: 1.2; letter-spacing: -0.025em; font-weight: 800; }
        .text-headline-lg { font-size: 2.25rem; line-height: 1.2; letter-spacing: -0.025em; font-weight: 800; }
        .font-headline-md { font-family: 'Fredoka', sans-serif; font-size: 1.875rem; line-height: 1.2; font-weight: 700; }
        .text-headline-md { font-size: 1.875rem; line-height: 1.2; font-weight: 700; }
        .font-body-lg { font-family: 'Nunito', sans-serif; font-size: 1.125rem; line-height: 1.5; font-weight: 700; }
        .text-body-lg { font-size: 1.125rem; line-height: 1.5; font-weight: 700; }
        .font-body-md { font-family: 'Nunito', sans-serif; font-size: 1rem; line-height: 1.5; font-weight: 600; }
        .text-body-md { font-size: 1rem; line-height: 1.5; font-weight: 600; }
      `}</style>
      

{/*  Navigation  */}
<nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b-8 border-surface-container-highest shadow-[0_4px_0_0_rgba(0,0,0,0.1)] px-bento-padding py-4 flex justify-between items-center">
<div className="flex items-center gap-2">
<span className="font-display-lg text-display-lg text-primary">Smile Sprout</span>
</div>
<div className="hidden md:flex items-center gap-8">
<Link className="text-primary font-bold transition-all hover:scale-105" to="/">Chơi</Link>
<Link className="text-on-surface-variant transition-all hover:scale-105" to="/">Khu Vườn</Link>
<Link className="text-on-surface-variant transition-all hover:scale-105" to="/">Bạn Bè</Link>
<Link className="text-on-surface-variant transition-all hover:scale-105" to="/">Giải Thưởng</Link>
</div>
<div className="flex items-center gap-4">
<Link to="/auth" className="px-6 py-2 rounded-lg font-headline-md text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95">
                Đăng Nhập
            </Link>
<Link to="/auth" className="bg-primary text-on-primary px-8 py-3 rounded-lg font-headline-md clay-button-primary transition-all active:translate-y-1 block text-center">
                Bắt Đầu Ngay
            </Link>
</div>
</nav>
{/*  Main Content  */}
<main className="pt-32 pb-24 px-container-padding max-w-[1440px] mx-auto space-y-24">
{/*  Hero Section  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-card-gap">
<div className="md:col-span-8 bg-primary-container text-on-primary-container rounded-xl p-bento-padding border-b-8 border-[#493598] clay-card relative overflow-hidden group">
<div className="relative z-10 max-w-lg">
<span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-body-md mb-6 inline-block">Chào mừng Nhà Khám Phá!</span>
<h1 className="font-display-lg text-display-lg mb-6 leading-tight">Học Về Cảm Xúc Qua Trò Chơi</h1>
<p className="font-body-lg text-body-lg opacity-90 mb-8">Tham gia cùng hàng ngàn trẻ em trong khu vườn kỳ diệu, nơi mỗi cảm xúc là một người bạn mới. An toàn, vui nhộn và được chuyên gia phê duyệt.</p>
<Link to="/auth" className="bg-on-primary-container text-primary px-12 py-6 rounded-xl font-headline-lg shadow-[0_8px_0_0_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all active:translate-y-1 active:shadow-none transform scale-110 origin-left inline-block text-center">
                        Khám Phá Ngay
                    </Link>
</div>
<div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
<img alt="Friendly sprout character" className="w-full h-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCSbTs8Usytz3Zgh5WrZxvtBpykWNo3FonQG_i9uVeCgNPDk1ela5k6C1kt3dfy5JiXZKonH0sjiKZD2nlFbhHj9YRE1_R-8iOWr_BFvLk4UsjHFpLk6Em1Qn1_T7cciHZc-15Au_WgqpkRkaXtXuAc--hztoVlXifdmVh5IXp0qVSqm6t9m3RZ6aOTAOiQPp2rnqmtm3CHy7mVGrtVGLv_BGIszFr18O0xDLyyAUoP9LEixV5a4QH0ka9OVp6ufZR0P2hQFFuRvA"/>
</div>
</div>
<div className="md:col-span-4 space-y-card-gap">
<div className="bg-tertiary-fixed text-on-tertiary-fixed rounded-xl p-8 border-b-8 border-tertiary-container clay-card group">
<div className="w-16 h-16 bg-tertiary-container rounded-lg flex items-center justify-center mb-6">
<Puzzle className="w-10 h-10 text-on-tertiary-container" />
</div>
<h2 className="font-headline-lg text-headline-lg mb-2">Trò Chơi Tương Tác</h2>
<p className="font-body-md text-body-md opacity-80">Các câu đố nhỏ vui nhộn giúp dạy kỹ năng điều chỉnh cảm xúc.</p>
</div>
<div className="bg-secondary-container text-on-secondary-container rounded-xl p-8 border-b-8 border-secondary clay-card group">
<div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center mb-6">
<ShieldCheck className="w-10 h-10 text-secondary" />
</div>
<h2 className="font-headline-lg text-headline-lg mb-2">An Toàn Cho Bé</h2>
<p className="font-body-md text-body-md">Không quảng cáo, không mạng xã hội. Một không gian an toàn để phát triển.</p>
</div>
</div>
</div>
{/*  How it Works Section  */}
<section>
<div className="text-center mb-12">
<h2 className="font-display-lg text-display-lg text-primary mb-4">Cách Hoạt Động</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">Hành trình 3 bước đơn giản để bé hiểu về chính mình.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap">
<div className="bg-surface-container-low p-10 rounded-xl border-b-8 border-surface-container-highest clay-card text-center relative overflow-hidden group">
<div className="absolute -top-4 -left-4 w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center font-display-lg text-2xl shadow-lg">1</div>
<div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
<Smile className="w-12 h-12 text-primary" />
</div>
<h3 className="font-headline-md mb-4">Chọn Cảm Xúc</h3>
<p className="text-on-surface-variant">Bé bắt đầu bằng cách chọn tâm trạng hiện tại của mình thông qua các nhân vật mầm cây đáng yêu.</p>
</div>
<div className="bg-surface-container-low p-10 rounded-xl border-b-8 border-surface-container-highest clay-card text-center relative overflow-hidden group">
<div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary text-on-primary rounded-full flex items-center justify-center font-display-lg text-2xl shadow-lg">2</div>
<div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
<BookOpen className="w-12 h-12 text-secondary" />
</div>
<h3 className="font-headline-md mb-4">Chơi &amp; Học</h3>
<p className="text-on-surface-variant">Tham gia vào các câu chuyện tương tác và trò chơi được thiết kế để giải quyết cảm xúc đó.</p>
</div>
<div className="bg-surface-container-low p-10 rounded-xl border-b-8 border-surface-container-highest clay-card text-center relative overflow-hidden group">
<div className="absolute -top-4 -left-4 w-16 h-16 bg-tertiary text-on-primary rounded-full flex items-center justify-center font-display-lg text-2xl shadow-lg">3</div>
<div className="w-24 h-24 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
<Leaf className="w-12 h-12 text-tertiary" />
</div>
<h3 className="font-headline-md mb-4">Gieo Mầm Kỹ Năng</h3>
<p className="text-on-surface-variant">Mỗi hoạt động giúp bé xây dựng sự tự tin và khả năng thấu cảm trong thế giới thực.</p>
</div>
</div>
</section>
{/*  Moodboard Section  */}
<section>
<div className="text-center mb-12">
<h2 className="font-display-lg text-display-lg text-primary mb-4">Hôm nay bé cảm thấy thế nào?</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">Chạm vào một mầm cây để bắt đầu câu chuyện về cảm xúc đó.</p>
</div>
<div className="flex flex-wrap justify-center gap-8">
<button className="flex flex-col items-center gap-3 group transition-transform hover:-translate-y-4">
<div className="w-32 h-32 rounded-full bg-emotion-happy border-b-8 border-[#d4c15b] flex items-center justify-center clay-card group-active:translate-y-2 group-active:border-b-0">
<Smile className="w-14 h-14 text-[#574400]" />
</div>
<span className="font-headline-md text-on-tertiary-container">Vui Vẻ</span>
</button>
<button className="flex flex-col items-center gap-3 group transition-transform hover:-translate-y-4">
<div className="w-32 h-32 rounded-full bg-emotion-sad border-b-8 border-[#7588b4] flex items-center justify-center clay-card group-active:translate-y-2 group-active:border-b-0">
<Frown className="w-14 h-14 text-white" />
</div>
<span className="font-headline-md text-on-surface-variant">Buồn Bã</span>
</button>
<button className="flex flex-col items-center gap-3 group transition-transform hover:-translate-y-4">
<div className="w-32 h-32 rounded-full bg-emotion-angry border-b-8 border-[#c26262] flex items-center justify-center clay-card group-active:translate-y-2 group-active:border-b-0">
<Angry className="w-14 h-14 text-white" />
</div>
<span className="font-headline-md text-on-surface-variant">Tức Giận</span>
</button>
<button className="flex flex-col items-center gap-3 group transition-transform hover:-translate-y-4">
<div className="w-32 h-32 rounded-full bg-emotion-excited border-b-8 border-[#c79c65] flex items-center justify-center clay-card group-active:translate-y-2 group-active:border-b-0">
<PartyPopper className="w-14 h-14 text-[#574400]" />
</div>
<span className="font-headline-md text-on-surface-variant">Hào Hứng</span>
</button>
<button className="flex flex-col items-center gap-3 group transition-transform hover:-translate-y-4">
<div className="w-32 h-32 rounded-full bg-emotion-surprised border-b-8 border-[#a47dad] flex items-center justify-center clay-card group-active:translate-y-2 group-active:border-b-0">
<Sparkles className="w-14 h-14 text-white" />
</div>
<span className="font-headline-md text-on-surface-variant">Ngạc Nhiên</span>
</button>
</div>
</section>
{/*  Features Grid Section  */}
<section>
<div className="text-center mb-12">
<h2 className="font-display-lg text-display-lg text-primary mb-4">Tính Năng Nổi Bật</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-card-gap">
<div className="bg-white p-6 rounded-xl border-b-4 border-surface-container-highest clay-card flex items-center gap-4">
<Ban className="w-8 h-8 text-secondary" />
<span className="font-headline-md">Không Quảng Cáo</span>
</div>
<div className="bg-white p-6 rounded-xl border-b-4 border-surface-container-highest clay-card flex items-center gap-4">
<Brain className="w-8 h-8 text-primary" />
<span className="font-headline-md">Chuyên Gia Tư Vấn</span>
</div>
<div className="bg-white p-6 rounded-xl border-b-4 border-surface-container-highest clay-card flex items-center gap-4">
<WifiOff className="w-8 h-8 text-tertiary" />
<span className="font-headline-md">Hỗ Trợ Ngoại Tuyến</span>
</div>
<div className="bg-white p-6 rounded-xl border-b-4 border-surface-container-highest clay-card flex items-center gap-4">
<Users className="w-8 h-8 text-emotion-angry" />
<span className="font-headline-md">Báo Cáo Phụ Huynh</span>
</div>
</div>
</section>
{/*  Testimonials Section  */}
<section>
<div className="text-center mb-12">
<h2 className="font-display-lg text-display-lg text-primary mb-4">Cảm Nhận Từ Phụ Huynh</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap">
<div className="bg-surface-bright p-8 rounded-xl border-b-8 border-surface-container-highest clay-card">
<div className="flex items-center gap-4 mb-6">
<img alt="Parent avatar" className="w-16 h-16 rounded-full border-4 border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLsE5twau7Yx0zP0IdACc23tvvjBB9BoRU-2FnXJ7sYuhH2FzQxm2yNsqaUvwtgAAOrYZ_3wxiCd3L1-VcNeHAzPs-NhjrsSR9oABY34pIJHzOsA_8qD-0Fiped_O3wsCd7E8yMwOlYEMsNa5RKUeF33Dw27bzcL_eB7qPMSLQ33g0M8i85T4htTfBpNeY_8Savh01fGjkqycHfHnkUrIQ-i2piBxAPppYTJWpRUrQtgH6DNciObXW4dEany-4twa7snRNQTGoTpo"/>
<div>
<h4 className="font-headline-md">Mẹ Lan Anh</h4>
<div className="flex text-emotion-happy gap-1"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
</div>
</div>
<p className="italic text-on-surface-variant font-body-md">"Bé nhà mình đã biết cách gọi tên cảm xúc của mình thay vì quấy khóc. Một ứng dụng thực sự ý nghĩa!"</p>
</div>
<div className="bg-surface-bright p-8 rounded-xl border-b-8 border-surface-container-highest clay-card">
<div className="flex items-center gap-4 mb-6">
<img alt="Parent avatar" className="w-16 h-16 rounded-full border-4 border-secondary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAybKBmHPGyqJiRghTygDLFXd_1ePpKzeq6GykCpoLksfAyUgJU-vD2AxBAIoz9cthHmqICBWdHRutD3iFk1s7KbSZRqLSPac423G2gGK4qNjkiHMY6-f-2tY9NYTwbRaauRsOTRXYehDigR48lCV2J8RsDcs4ashe-tUX1xSzHuVj0pKaBrK9DUrLDJdMkXTZcYh1zdpgU_93HpP-8TBnPa6sH6Gh1iCSCCu3whahSEuOHGgx8k-bKSe6IrqcczBAJWdbDDmoI-f4"/>
<div>
<h4 className="font-headline-md">Bố Minh Quang</h4>
<div className="flex text-emotion-happy gap-1"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
</div>
</div>
<p className="italic text-on-surface-variant font-body-md">"Thiết kế quá đẹp và thân thiện. Con tôi rất thích các trò chơi giải đố về cảm xúc ở đây."</p>
</div>
<div className="bg-surface-bright p-8 rounded-xl border-b-8 border-surface-container-highest clay-card">
<div className="flex items-center gap-4 mb-6">
<div className="w-16 h-16 rounded-full bg-emotion-surprised flex items-center justify-center text-white font-display-lg border-4 border-white shadow-md">T</div>
<div>
<h4 className="font-headline-md">Chị Thanh Tâm</h4>
<div className="flex text-emotion-happy gap-1"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
</div>
</div>
<p className="italic text-on-surface-variant font-body-md">"Mình đánh giá cao việc không có quảng cáo. Cảm ơn đội ngũ phát triển vì môi trường an toàn này."</p>
</div>
</div>
</section>
{/*  CTA Section  */}
<section className="bg-primary text-on-primary rounded-xl p-16 text-center border-b-[12px] border-[#493598] clay-card relative overflow-hidden">
<div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
<div className="relative z-10">
<h2 className="font-display-lg text-display-lg mb-8 max-w-2xl mx-auto">Bắt đầu gieo mầm trí tuệ cảm xúc cho bé ngay hôm nay!</h2>
<div className="flex flex-col md:flex-row gap-8 justify-center items-center">
<Link to="/auth" className="bg-white text-primary px-16 py-8 rounded-xl font-headline-lg shadow-[0_12px_0_0_#e6e1ea] hover:-translate-y-2 transition-all active:translate-y-2 active:shadow-none min-w-[320px] text-2xl inline-block text-center">
                        Dùng Thử Miễn Phí
                    </Link>
<Link to="/auth" className="bg-secondary-container text-on-secondary-container px-16 py-8 rounded-xl font-headline-lg shadow-[0_12px_0_0_#00513e] hover:-translate-y-2 transition-all active:translate-y-2 active:shadow-none min-w-[320px] text-2xl inline-block text-center">
                        Hướng Dẫn Phụ Huynh
                    </Link>
</div>
<p className="mt-12 font-body-lg opacity-80">Gia nhập cộng đồng 50,000+ mầm nhỏ đang học tập mỗi ngày.</p>
</div>
</section>
</main>
{/*  Mobile Bottom Nav  */}
<div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe h-24 bg-surface border-t-8 border-surface-container-highest rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
<div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-lg px-6 py-2 shadow-[inset_0_4px_4px_rgba(0,0,0,0.2)] translate-y-1">
<Puzzle className="w-6 h-6" />
<span className="text-body-lg font-body-lg">Chơi</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2">
<Leaf className="w-6 h-6" />
<span className="text-body-lg font-body-lg">Vườn</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2">
<Users className="w-6 h-6" />
<span className="text-body-lg font-body-lg">Bạn</span>
</div>
<div className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2">
<Star className="w-6 h-6" />
<span className="text-body-lg font-body-lg">Giải</span>
</div>
</div>
{/*  Footer  */}
<footer className="bg-surface-dim pt-24 pb-32 md:pb-12 border-t-8 border-surface-container-highest">
<div className="max-w-[1440px] mx-auto px-container-padding grid grid-cols-1 md:grid-cols-4 gap-12">
<div>
<span className="font-display-lg text-headline-lg text-primary block mb-6">Smile Sprout</span>
<p className="text-on-surface-variant font-body-md">Xây dựng tương lai thấu cảm hơn, bắt đầu từ từng mầm nhỏ.</p>
</div>
<div>
<h4 className="font-headline-md mb-6">Khám Phá</h4>
<ul className="space-y-4">
<li><Link className="text-on-surface-variant hover:text-primary transition-colors" to="/">Trò Chơi</Link></li>
<li><Link className="text-on-surface-variant hover:text-primary transition-colors" to="/">Lộ Trình Học</Link></li>
<li><Link className="text-on-surface-variant hover:text-primary transition-colors" to="/">Cẩm Nang Phụ Huynh</Link></li>
</ul>
</div>
<div>
<h4 className="font-headline-md mb-6">Về Chúng Tôi</h4>
<ul className="space-y-4">
<li><Link className="text-on-surface-variant hover:text-primary transition-colors" to="/">Sứ Mệnh</Link></li>
<li><Link className="text-on-surface-variant hover:text-primary transition-colors" to="/">Chính Sách Bảo Mật</Link></li>
<li><Link className="text-on-surface-variant hover:text-primary transition-colors" to="/">Trung Tâm An Toàn</Link></li>
</ul>
</div>
<div>
<h4 className="font-headline-md mb-6">Kết Nối</h4>
<div className="flex gap-4">
<div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
<Share2 className="w-6 h-6" />
</div>
<div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
<Mail className="w-6 h-6" />
</div>
</div>
</div>
</div>
</footer>

    </div>
  );
};

export default LandingPage;
