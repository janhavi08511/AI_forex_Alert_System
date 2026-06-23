import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginService, logout as logoutService } from "../services/authService";

interface AuthUser {
  email?: string;
  name?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setUser({ email: "user@example.com" });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService({ email, password });
    if (response.token) {
      setToken(response.token);
      setUser({ email, name: email.split("@")[0] });
    }
  };

  const logout = () => {
    logoutService();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      user,
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
