import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthResponse {
  user: User;
  access: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Standard Vite way to access env variables without 'any'
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for HttpOnly cookies
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/users/me/");
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/auth/login/", {
      email,
      password,
    });
    setUser(response.data.user);
    // SECURITY FIX: Access token stored in memory only (NOT localStorage).
    // Refresh token relies on the HttpOnly Secure cookie.
  };

  const logout = async () => {
    try {
      await api.post("/auth/auth/logout/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Export the context for the separate hook file to use
export { AuthContext };
