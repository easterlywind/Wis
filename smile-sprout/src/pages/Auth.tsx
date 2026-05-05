import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import mascot from "@/assets/mascot.png";
import { useAuth } from "../hooks/useAuth";
import {
  isStrongPassword,
  isValidEmail,
  isValidBirthDate,
  validateRegistrationInput,
} from "@/lib/auth-validation";

const Auth = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
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
        // Validate all registration fields using centralized validator
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
          birthDate: birthDate || null, // optional
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
    <div className="min-h-screen flex items-center justify-center p-4 app-bg">
      <Card
        className="max-w-md w-full p-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-hover border-2 border-white/60 animate-scale-in"
        id="auth-card"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={mascot}
            alt="Mascot"
            className="w-20 h-20 mx-auto mb-4 animate-float"
          />
          <h1 className="text-3xl font-extrabold mb-2 text-foreground">
            {isLogin ? "Chào mừng trở lại! 👋" : "Tạo tài khoản mới 🎉"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Đăng nhập để tiếp tục học"
              : "Bắt đầu hành trình học cảm xúc"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-bold">
                Tên người dùng
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên bé"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-xl text-base border-2 focus:border-primary"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-bold">
              Email phụ huynh
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl text-base border-2 focus:border-primary"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-foreground font-bold">
                Ngày sinh (tùy chọn)
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="h-12 rounded-xl text-base border-2 focus:border-primary"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-bold">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);

                if (!isLogin) {
                  // Strong password check – using centralized validator
                  if (!isStrongPassword(value)) {
                    setPasswordError(
                      "Mật khẩu cần ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt."
                    );
                  } else {
                    setPasswordError("");
                  }

                  // Confirm password live-check
                  if (confirmPassword && value !== confirmPassword) {
                    setConfirmPasswordError(
                      "Mật khẩu không khớp với xác nhận."
                    );
                  } else {
                    setConfirmPasswordError("");
                  }
                }
              }}
              className="h-12 rounded-xl text-base border-2 focus:border-primary"
            />
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold">
              ⚠️ {passwordError}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-bold">
                Xác nhận mật khẩu
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmPassword(value);

                  if (value !== password)
                    setConfirmPasswordError(
                      "Mật khẩu và xác nhận mật khẩu không khớp."
                    );
                  else setConfirmPasswordError("");
                }}
                className="h-12 rounded-xl text-base border-2 focus:border-primary"
              />
            </div>
          )}

          {confirmPasswordError && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold">
              ⚠️ {confirmPasswordError}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold">
              ❌ {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-extrabold rounded-2xl gradient-primary text-white shadow-glow hover:shadow-lg transition-all"
            id="auth-submit-btn"
          >
            {isLoading
              ? "Đang xử lý..."
              : isLogin
              ? "Đăng nhập →"
              : "Đăng ký →"}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setErrorMessage("");
              setPasswordError("");
              setConfirmPasswordError("");
              setIsLogin(!isLogin);
            }}
            className="text-primary hover:underline font-bold text-sm"
            id="auth-toggle-btn"
          >
            {isLogin
              ? "Chưa có tài khoản? Đăng ký ngay →"
              : "← Đã có tài khoản? Đăng nhập"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
