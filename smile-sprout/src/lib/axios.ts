import axios from "axios";
import { refreshApi } from "./auth.api";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: false,
});

// REQUEST INTERCEPTOR – tự gắn token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR – tự refresh token khi 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshApi(
          localStorage.getItem("refresh_token")!
        );

        localStorage.setItem("access_token", res.accessToken);
        localStorage.setItem("refresh_token", res.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }

    return Promise.reject(err);
  }
);
