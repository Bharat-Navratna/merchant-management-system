import axios from "axios";
import { clearAuth, getAccessToken, getRefreshToken, persistAuth } from "@/lib/auth";

export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:5000/api",
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      typeof window !== "undefined"
    ) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api"}/auth/refresh`,
          { refreshToken },
        );

        const nextAccessToken = refreshResponse.data?.data?.accessToken;
        const nextRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (!nextAccessToken || !nextRefreshToken) {
          throw new Error("Missing refresh tokens");
        }

        persistAuth({ accessToken: nextAccessToken, refreshToken: nextRefreshToken });
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
