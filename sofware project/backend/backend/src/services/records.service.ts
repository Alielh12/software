import prisma from "../prisma/client";
import { AppError } from "../middlewares/errorHandler";
import { logger } from "../server";
import { config } from "../config";

class RecordsService {
  async getEncryptedRecord(recordId: string, userId: string, userRole: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: {
        files: true,
      },
    });

    if (!record) {
      throw new AppError("Medical record not found", 404, "RECORD_NOT_FOUND");
    }

    // Check access
    if (userRole === "STUDENT" && record.userId !== userId) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    return record;
  }

  async getDecryptionKey(
    recordId: string,
    userId: string,
    userRole: string,
    keyId?: string
  ) {
    // Verify access first
    await this.verifyAccess(recordId, userId, userRole);

    // In production, retrieve key from key management service
    // For now, return a demo key (should be fetched from secure storage)
    const key = config.encryptionKey || "demo-key-base64-encoded-32-bytes-key!!";

    return {
      key,
      keyId: keyId || "default",
    };
  }

  async verifyAccess(recordId: string, userId: string, userRole: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new AppError("Medical record not found", 404, "RECORD_NOT_FOUND");
    }

    // Staff can access all records, students only their own
    if (userRole === "STUDENT" && record.userId !== userId) {
      return false;
    }

    return true;
  }

  async createRecord(data: any) {
    // Encryption should happen here before storing
    const record = await prisma.medicalRecord.create({
      data: {
        userId: data.userId,
        doctorId: data.doctorId,
        encryptedData: data.encryptedData,
        keyId: data.keyId,
      },
    });

    logger.info({ recordId: record.id }, "Medical record created");

    return record;
  }

  async getRecords(userId: string, userRole: string) {
    const where: any = userRole === "STUDENT" ? { userId } : {};

    return prisma.medicalRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async getRecordById(recordId: string, userId: string, userRole: string) {
    const record = await this.getEncryptedRecord(recordId, userId, userRole);
    return record;
  }
}

export const recordsService = new RecordsService();

