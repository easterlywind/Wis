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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 app-bg">
      <Card className="max-w-md w-full p-8 gradient-card shadow-active animate-scale-in">
        <div className="text-center mb-8">
          <img
            src={mascot}
            alt="Mascot"
            className="w-24 h-24 mx-auto mb-4 animate-float"
          />
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            {isLogin ? "Chào mừng trở lại! 👋" : "Tạo tài khoản mới 🎉"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Đăng nhập để tiếp tục học"
              : "Bắt đầu hành trình học cảm xúc"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Tên người dùng
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email phụ huynh
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-foreground">
                Ngày sinh (optional)
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
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
              className="h-12"
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
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
                className="h-12"
              />
            </div>
          )}

          {confirmPasswordError && (
            <p className="text-sm text-red-500">{confirmPasswordError}</p>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-lg gradient-primary text-gray-900"
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setErrorMessage("");
              setIsLogin(!isLogin);
            }}
            className="text-primary hover:underline font-semibold"
          >
            {isLogin
              ? "Chưa có tài khoản? Đăng ký ngay"
              : "Đã có tài khoản? Đăng nhập"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
