import { api } from "@/services/api";
import { User, LoginRequest, RegisterRequest, ApiResponse } from "@/types";
import jwtDecode from "jwt-decode";

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

export const authService = {
  async login(
    credentials: LoginRequest
  ): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/login",
      credentials
    );

    if (response.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(response.error || "Login failed");
  },

  async register(
    userData: RegisterRequest
  ): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      "/auth/register",
      userData
    );

    if (response.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(response.error || "Registration failed");
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: JWTPayload = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.isTokenValid();
  },
};
