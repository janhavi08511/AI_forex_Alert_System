import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
const normalizedBaseUrl = rawBaseUrl.includes("||")
  ? rawBaseUrl.split("||")[0].trim()
  : rawBaseUrl.trim();

const api = axios.create({
  baseURL: normalizedBaseUrl || "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
