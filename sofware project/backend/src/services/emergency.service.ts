import prisma from "../prisma/client";
import { AppError } from "../middlewares/errorHandler";
import { logger } from "../server";

class EmergencyService {
  async createRequest(data: any) {
    const emergency = await prisma.emergencyRequest.create({
      data: {
        userId: data.userId,
        priority: data.priority || "MEDIUM",
        description: data.description,
        location: data.location,
        phone: data.phone,
      },
    });

    logger.warn({ emergencyId: emergency.id, priority: emergency.priority }, "Emergency request created");

    return emergency;
  }

  async getRequests(userRole: string, status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    return prisma.emergencyRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });
  }

  async getRequestById(id: string, userId: string, userRole: string) {
    const emergency = await prisma.emergencyRequest.findUnique({
      where: { id },
      include: {
        user: true,
        staff: true,
      },
    });

    if (!emergency) {
      throw new AppError("Emergency request not found", 404, "NOT_FOUND");
    }

    if (userRole === "STUDENT" && emergency.userId !== userId) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    return emergency;
  }

  async assignStaff(emergencyId: string, staffId: string, assignedBy: string) {
    const emergency = await prisma.emergencyRequest.update({
      where: { id: emergencyId },
      data: {
        assignedTo: staffId,
        status: "ASSIGNED",
      },
      include: {
        staff: true,
      },
    });

    logger.info({ emergencyId, staffId }, "Staff assigned to emergency");
    return emergency;
  }

  async updateStatus(emergencyId: string, status: string, updatedBy: string) {
    const emergency = await prisma.emergencyRequest.update({
      where: { id: emergencyId },
      data: {
        status: status as any,
        ...(status === "RESOLVED" && { resolvedAt: new Date() }),
      },
    });

    logger.info({ emergencyId, status }, "Emergency status updated");
    return emergency;
  }
}

export const emergencyService = new EmergencyService();

