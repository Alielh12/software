import axiosInstance from "./axios";
import type { PatientRecord } from "@/types/record";

export interface EncryptedRecord {
  id: string;
  userId: string;
  doctorId?: string;
  encryptedData: string; // Base64-encoded encrypted JSON
  encryptedFiles?: EncryptedFile[];
  createdAt: string;
  updatedAt: string;
  keyId?: string; // Reference to decryption key
}

export interface EncryptedFile {
  id: string;
  name: string;
  encryptedData: string; // Base64-encoded encrypted file
  mimeType: string;
  size: number;
  keyId?: string;
}

export interface DecryptedRecordData {
  diagnosis?: string;
  prescriptions?: Prescription[];
  doctorNotes?: string;
  labResults?: LabResult[];
  vitalSigns?: VitalSigns;
  attachments?: Array<{
    name: string;
    type: string;
    data: Blob;
  }>;
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface LabResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange?: string;
  date: string;
}

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  date: string;
}

/**
 * Fetch encrypted medical record
 */
export const getEncryptedRecord = async (
  recordId: string
): Promise<EncryptedRecord> => {
  const response = await axiosInstance.get(`/records/${recordId}/encrypted`);
  return response.data;
};

/**
 * Fetch decryption key for a record
 * In production, this might require additional authentication
 */
export const getDecryptionKey = async (
  recordId: string,
  keyId?: string
): Promise<{ key: string; keyId: string }> => {
  const params = keyId ? { keyId } : {};
  const response = await axiosInstance.get(`/records/${recordId}/key`, {
    params,
  });
  return response.data;
};

/**
 * Verify user has access to record
 */
export const verifyRecordAccess = async (
  recordId: string
): Promise<{ hasAccess: boolean; reason?: string }> => {
  try {
    await axiosInstance.get(`/records/${recordId}/verify-access`);
    return { hasAccess: true };
  } catch (error: any) {
    if (error.response?.status === 403) {
      return {
        hasAccess: false,
        reason: error.response?.data?.error || "Access denied",
      };
    }
    throw error;
  }
};

