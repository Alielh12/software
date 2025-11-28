export interface PatientRecord {
  id: string;
  userId: string;
  doctorId?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: {
    firstName: string;
    lastName: string;
  };
}

