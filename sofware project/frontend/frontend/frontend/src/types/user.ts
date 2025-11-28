export type UserRole = "STUDENT" | "DOCTOR" | "NURSE" | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

