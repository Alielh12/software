import axiosInstance from "./axios";
import type { Appointment } from "@/types/appointment";

export interface CreateAppointmentData {
  date: string;
  reason?: string;
  doctorId?: string;
  serviceId?: string;
}

export interface UpdateAppointmentData {
  date?: string;
  reason?: string;
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
}

// Get all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get("/appointments");
  return response.data;
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const response = await axiosInstance.get(`/appointments/${id}`);
  return response.data;
};

// Create appointment
export const createAppointment = async (
  data: CreateAppointmentData
): Promise<Appointment> => {
  const response = await axiosInstance.post("/appointments", data);
  return response.data;
};

// Update appointment
export const updateAppointment = async (
  id: string,
  data: UpdateAppointmentData
): Promise<Appointment> => {
  const response = await axiosInstance.put(`/appointments/${id}`, data);
  return response.data;
};

// Delete appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/appointments/${id}`);
};

