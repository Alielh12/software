import axiosInstance from "./axios";

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty?: string;
  phone?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price?: number;
}

export interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}

// Get all doctors
export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await axiosInstance.get("/doctors");
  return response.data;
};

// Get doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor> => {
  const response = await axiosInstance.get(`/doctors/${id}`);
  return response.data;
};

// Get available services
export const getServices = async (): Promise<Service[]> => {
  const response = await axiosInstance.get("/services");
  return response.data;
};

// Get available time slots for a doctor on a specific date
export const getAvailableSlots = async (
  doctorId: string,
  date: string,
  serviceDuration?: number
): Promise<AvailableSlot[]> => {
  const response = await axiosInstance.get("/appointments/available-slots", {
    params: {
      doctorId,
      date,
      duration: serviceDuration,
    },
  });
  return response.data;
};

