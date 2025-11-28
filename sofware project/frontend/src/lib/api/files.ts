import axiosInstance from "./axios";

// Upload files for an appointment
export const uploadAppointmentFiles = async (
  appointmentId: string,
  files: File[]
): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post(
    `/appointments/${appointmentId}/files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Get appointment files
export const getAppointmentFiles = async (
  appointmentId: string
): Promise<Array<{ id: string; name: string; url: string; size: number }>> => {
  const response = await axiosInstance.get(`/appointments/${appointmentId}/files`);
  return response.data;
};

// Delete appointment file
export const deleteAppointmentFile = async (
  appointmentId: string,
  fileId: string
): Promise<void> => {
  await axiosInstance.delete(`/appointments/${appointmentId}/files/${fileId}`);
};

