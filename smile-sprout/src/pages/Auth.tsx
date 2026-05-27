import { useState } from "react";
import { Smile, Star, Badge, User, Calendar, Lock, Rocket, Puzzle, Brain, Users } from "lucide-react";

import { toast } from "sonner";
import mascot from "@/assets/mascot.png";
import { useAuth } from "../hooks/useAuth";
import { validateRegistrationInput } from "@/lib/auth-validation";

const Auth = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Đăng nhập thành công! 🎉");
      } else {
        const validationError = validateRegistrationInput({
          username,
          email,
          birthDate,
          password,
          confirmPassword,
        });

        if (validationError) {
          setErrorMessage(validationError);
          setIsLoading(false);
          return;
        }

        await register({
          username,
          email,
          password,
          birthDate: birthDate || null,
        });
        toast.success("Đăng ký thành công! 🎉");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi hệ thống");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden" style={{ background: 'radial-gradient(circle at 20% 20%, #e6deff 0%, transparent 40%), radial-gradient(circle at 80% 80%, #9cf4d3 0%, transparent 40%), #f4f6f9' }}>
      <style>{`
        .clay-card-auth {
            box-shadow: 
                0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                0 10px 10px -5px rgba(0, 0, 0, 0.04),
                inset 0 4px 6px rgba(255, 255, 255, 0.8),
                inset 0 -4px 6px rgba(0, 0, 0, 0.05);
        }

        .clay-button-auth {
            box-shadow: 
                0 8px 0 0 #493598,
                0 15px 20px rgba(0, 0, 0, 0.15),
                inset 0 4px 4px rgba(255, 255, 255, 0.3),
                inset 0 -4px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .clay-button-auth:active {
            transform: translateY(6px);
            box-shadow: 
                0 2px 0 0 #493598,
                0 5px 10px rgba(0, 0, 0, 0.1),
                inset 0 4px 4px rgba(255, 255, 255, 0.2),
                inset 0 -4px 4px rgba(0, 0, 0, 0.3);
        }

        .soft-well-auth {
            box-shadow: 
                inset 4px 4px 8px rgba(0, 0, 0, 0.08),
                inset -4px -4px 8px rgba(255, 255, 255, 0.9);
            border: none;
        }

        .font-display-lg { font-family: 'Quicksand', sans-serif; font-size: 3rem; line-height: 1.1; letter-spacing: -0.025em; font-weight: 800; }
        .text-display-lg { font-size: 3rem; line-height: 1.1; letter-spacing: -0.025em; font-weight: 800; }
        .font-headline-lg { font-family: 'Quicksand', sans-serif; font-size: 2.25rem; line-height: 1.2; letter-spacing: -0.025em; font-weight: 800; }
        .text-headline-lg { font-size: 2.25rem; line-height: 1.2; letter-spacing: -0.025em; font-weight: 800; }
        .font-headline-md { font-family: 'Quicksand', sans-serif; font-size: 1.875rem; line-height: 1.2; font-weight: 700; }
        .text-headline-md { font-size: 1.875rem; line-height: 1.2; font-weight: 700; }
        .font-body-lg { font-family: 'Nunito', sans-serif; font-size: 1.125rem; line-height: 1.5; font-weight: 700; }
        .text-body-lg { font-size: 1.125rem; line-height: 1.5; font-weight: 700; }
        .font-body-md { font-family: 'Nunito', sans-serif; font-size: 1rem; line-height: 1.5; font-weight: 600; }
        .text-body-md { font-size: 1rem; line-height: 1.5; font-weight: 600; }
      `}</style>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center items-center px-bento-padding py-6">
        <h1 className="font-display-lg text-display-lg text-primary select-none">Smile Sprout</h1>
      </header>

      <main className="w-full max-w-2xl mt-16 relative z-10">
        {/* Main Login/Register Card */}
        <div className="clay-card-auth bg-surface p-bento-padding rounded-xl border-b-8 border-surface-container-highest flex flex-col items-center gap-8 relative overflow-hidden">
          
          {/* Decorative Mascot/Icon Area */}
          <div className="w-32 h-32 bg-secondary-container rounded-full flex items-center justify-center relative shadow-inner">
            <Smile className="text-secondary w-16 h-16" strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 bg-emotion-happy w-10 h-10 rounded-full flex items-center justify-center shadow-md">
              <Star className="text-on-tertiary-container w-6 h-6" fill="currentColor" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center space-y-2">
            <h2 className="font-headline-lg text-headline-lg text-primary">
              {isLogin ? "Chào mừng Nhà thám hiểm quay trở lại!" : "Tạo mới tài khoản thám hiểm!"}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isLogin ? "Sẵn sàng chăm sóc vườn hoa nụ cười chưa nào?" : "Bắt đầu hành trình khám phá cảm xúc nhé!"}
            </p>
          </div>

          {errorMessage && (
            <div className="w-full max-w-md p-4 bg-error-container text-on-error-container rounded-lg font-body-md">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form className="w-full space-y-6 max-w-md" onSubmit={handleSubmit}>
            <div className="space-y-4">
              
              {!isLogin && (
                <div className="space-y-2">
                  <label className="font-body-lg text-body-lg text-on-surface ml-2">Tên gọi của bạn?</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="soft-well-auth w-full h-16 pl-14 pr-6 rounded-lg font-body-md text-body-md bg-surface-container-low text-on-surface focus:ring-4 focus:ring-primary-fixed focus:outline-none transition-all placeholder:text-outline-variant" 
                      placeholder="Nickname của bạn" 
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email/Username Field */}
              <div className="space-y-2">
                <label className="font-body-lg text-body-lg text-on-surface ml-2">
                  {isLogin ? "Bạn là ai thế nhỉ?" : "Email của bạn là gì?"}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="soft-well-auth w-full h-16 pl-14 pr-6 rounded-lg font-body-md text-body-md bg-surface-container-low text-on-surface focus:ring-4 focus:ring-primary-fixed focus:outline-none transition-all placeholder:text-outline-variant" 
                    placeholder={isLogin ? "Tên đăng nhập hoặc Email" : "email@example.com"} 
                    required 
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="font-body-lg text-body-lg text-on-surface ml-2">Ngày sinh của bạn?</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                    <input 
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="soft-well-auth w-full h-16 pl-14 pr-6 rounded-lg font-body-md text-body-md bg-surface-container-low text-on-surface focus:ring-4 focus:ring-primary-fixed focus:outline-none transition-all placeholder:text-outline-variant" 
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="font-body-lg text-body-lg text-on-surface">Mã số bí mật</label>
                  {isLogin && <a className="font-body-md text-body-md text-primary hover:underline transition-all" href="#">Quên mật mã mất rồi?</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="soft-well-auth w-full h-16 pl-14 pr-12 rounded-lg font-body-md text-body-md bg-surface-container-low text-on-surface focus:ring-4 focus:ring-primary-fixed focus:outline-none transition-all placeholder:text-outline-variant" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="font-body-lg text-body-lg text-on-surface ml-2">Nhập lại mã số bí mật nhé</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="soft-well-auth w-full h-16 pl-14 pr-12 rounded-lg font-body-md text-body-md bg-surface-container-low text-on-surface focus:ring-4 focus:ring-primary-fixed focus:outline-none transition-all placeholder:text-outline-variant" 
                      placeholder="••••••••" 
                      required={!isLogin} 
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button disabled={isLoading} className="clay-button-auth w-full h-20 bg-primary text-on-primary rounded-lg font-headline-md text-headline-md flex items-center justify-center gap-3 disabled:opacity-70" type="submit">
                <Rocket className="w-10 h-10" />
                {isLoading ? "Đang bay..." : (isLogin ? "Cùng chơi thôi!" : "Bắt đầu hành trình!")}
              </button>
            </div>
          </form>

          {/* Bottom Links */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isLogin ? "Bạn mới tới à?" : "Bạn đã có tài khoản rồi?"}
            </p>
            <button 
              type="button"
              onClick={() => {
                setErrorMessage("");
                setIsLogin(!isLogin);
              }}
              className="font-body-lg text-body-lg text-secondary bg-secondary-container px-8 py-3 rounded-full hover:scale-105 transition-transform active:scale-95 border-b-4 border-on-secondary-fixed-variant"
            >
              {isLogin ? "Tạo tài khoản mới nhé" : "Đăng nhập ngay nhé"}
            </button>
          </div>

          {/* Background Decoration Elements */}
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-fixed-dim/20 rounded-full blur-2xl"></div>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary-fixed/20 rounded-full blur-2xl"></div>
        </div>

        {/* Fun Illustration/Visual Element */}
        <div className="mt-12 grid grid-cols-3 gap-card-gap px-4">
          <div className="clay-card-auth bg-emotion-happy/30 p-4 rounded-lg flex flex-col items-center text-center gap-2 border-b-4 border-emotion-happy">
            <Puzzle className="text-on-tertiary-fixed w-8 h-8" />
            <span className="font-body-md text-body-md text-on-tertiary-fixed">Trò chơi vui</span>
          </div>
          <div className="clay-card-auth bg-emotion-excited/30 p-4 rounded-lg flex flex-col items-center text-center gap-2 border-b-4 border-emotion-excited">
            <Brain className="text-on-tertiary-fixed w-8 h-8" />
            <span className="font-body-md text-body-md text-on-tertiary-fixed">Lớn khôn hơn</span>
          </div>
          <div className="clay-card-auth bg-accent/30 p-4 rounded-lg flex flex-col items-center text-center gap-2 border-b-4 border-accent">
            <Users className="text-on-primary-fixed w-8 h-8" />
            <span className="font-body-md text-body-md text-on-primary-fixed">Cùng chiến thắng</span>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-12 overflow-hidden pointer-events-none opacity-40">
        <div className="flex gap-4 justify-center items-end">
          <div className="w-24 h-24 bg-secondary rounded-full -mb-12"></div>
          <div className="w-32 h-32 bg-primary rounded-full -mb-16"></div>
          <div className="w-20 h-20 bg-emotion-surprised rounded-full -mb-10"></div>
          <div className="w-28 h-28 bg-accent rounded-full -mb-14"></div>
          <div className="w-32 h-32 bg-tertiary-container rounded-full -mb-16"></div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
