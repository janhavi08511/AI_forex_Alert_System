import api from "./api";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
}

export async function register(payload: RegisterPayload) {
  const response = await api.post<AuthResponse>("/api/auth/register", payload);
  return response.data;
}

export async function login(payload: LoginPayload) {
  const response = await api.post<AuthResponse>("/api/auth/login", payload);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}
