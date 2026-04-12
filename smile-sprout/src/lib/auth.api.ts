import { api } from "./axios";

export const loginApi = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

export const registerApi = async (username: string, email: string, password: string, birthDate: string) => {
    const res = await api.post("/auth/register", { username, email, password, birthDate });
    return res.data;
};

export const logoutApi = () => {
    localStorage.removeItem("access_token");
};

export const refreshApi = (refreshToken: string) =>
  api.post("/auth/refresh", {
    refreshToken,
  }).then((r) => r.data);