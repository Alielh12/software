import axiosInstance from "./axios";
import type { User } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "STUDENT" | "DOCTOR" | "NURSE" | "ADMIN";
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Login - token will be set as HttpOnly cookie by backend
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/login", credentials);
  // Backend should set HttpOnly cookie
  // If token is in response, we'll store it differently
  return response.data;
};

// Register
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

// Logout - clears HttpOnly cookie
export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data.user;
  } catch (error) {
    return null;
  }
};

// Refresh token
export const refreshToken = async (): Promise<string> => {
  const response = await axiosInstance.post("/auth/refresh");
  return response.data.token;
};

