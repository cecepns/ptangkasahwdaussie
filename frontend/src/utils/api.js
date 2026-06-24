import axios from "axios";
import { API_CONFIG } from "./endpoints";

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export function getUploadBaseUrl() {
  return API_CONFIG.uploadURL;
}

export function resolveMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  return `${API_CONFIG.uploadURL}${url.startsWith("/") ? url : `/${url}`}`;
}
