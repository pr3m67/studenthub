import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost/api";

export const http = axios.create({
  baseURL,
  withCredentials: true,
});

let refreshPromise = null;

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      refreshPromise ??= axios.post(`${baseURL}/auth/token/refresh/`, {}, { withCredentials: true }).finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return http(originalRequest);
    }
    return Promise.reject(error);
  }
);
