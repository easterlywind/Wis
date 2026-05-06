import { loginApi, registerApi, logoutApi } from "../lib/auth.api";
import { saveSession, clearSession } from "../lib/auth-session";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Hook quản lý xác thực người dùng
 * - login / register / logout
 * - Đồng bộ trạng thái đăng nhập giữa các tab
 */
export function useAuth() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  /* ── LOGIN ── */
  const login = async (email: string, password: string) => {
    const res = await loginApi(email.trim().toLowerCase(), password.trim());

    if (res.accessToken) {
      saveSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: res.user,
      });

      setIsAuthenticated(true);
      navigate("/levels");
    }

    return res;
  };

  /* ── REGISTER ── */
  const register = async (data: {
    username: string;
    email: string;
    password: string;
    birthDate?: string | null;
  }) => {
    const { username, email, password, birthDate } = data;

    const res = await registerApi(
      username.trim(),
      email.trim().toLowerCase(),
      password.trim(),
      birthDate || undefined
    );

    if (res.accessToken) {
      saveSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: res.user,
      });

      setIsAuthenticated(true);
      navigate("/levels");
    } else {
      navigate("/");
    }

    return res;
  };

  /* ── LOGOUT ── */
  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearSession();
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  /* ── Sync login state giữa nhiều tab ── */
  useEffect(() => {
    const sync = () => {
      setIsAuthenticated(!!localStorage.getItem("access_token"));
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return { login, register, logout, isAuthenticated };
}
