import { Prisma } from "@prisma/client";
import prisma from "../prisma/client";
import { AppError } from "../middlewares/errorHandler";
import { logger } from "../server";
import { addMinutes, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

export interface CreateAppointmentData {
  userId: string;
  doctorId?: string;
  serviceId?: string;
  date: Date;
  duration?: number;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  date?: Date;
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  reason?: string;
  notes?: string;
  doctorId?: string;
}

export interface AppointmentFilters {
  userId?: string;
  doctorId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}

class AppointmentsService {
  /**
   * Create a new appointment
   */
  async createAppointment(data: CreateAppointmentData) {
    // Validate date is in the future
    if (isBefore(data.date, new Date())) {
      throw new AppError("Appointment date must be in the future", 400, "INVALID_DATE");
    }

    // Check if doctor exists if provided
    if (data.doctorId) {
      const doctor = await prisma.user.findUnique({
        where: { id: data.doctorId, role: "DOCTOR" },
      });

      if (!doctor) {
        throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
      }

      // Check availability
      const isAvailable = await this.checkDoctorAvailability(
        data.doctorId,
        data.date,
        data.duration || 30
      );

      if (!isAvailable) {
        throw new AppError(
          "Doctor is not available at this time",
          409,
          "DOCTOR_UNAVAILABLE"
        );
      }
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: data.userId,
        doctorId: data.doctorId,
        date: data.date,
        duration: data.duration || 30,
        reason: data.reason,
        notes: data.notes,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    logger.info(
      { appointmentId: appointment.id, userId: data.userId },
      "Appointment created"
    );

    return appointment;
  }

  /**
   * Get appointments with filters
   */
  async getAppointments(filters: AppointmentFilters, userRole: string, userId: string) {
    const where: Prisma.AppointmentWhereInput = {};

    // Students can only see their own appointments
    if (userRole === "STUDENT") {
      where.userId = userId;
    } else if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.doctorId) {
      where.doctorId = filters.doctorId;
    }

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return appointments;
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id: string, userRole: string, userId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        files: true,
      },
    });

    if (!appointment) {
      throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    }

    // Check access: students can only view their own appointments
    if (userRole === "STUDENT" && appointment.userId !== userId) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    return appointment;
  }

  /**
   * Update appointment
   */
  async updateAppointment(
    id: string,
    data: UpdateAppointmentData,
    userRole: string,
    userId: string
  ) {
    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    }

    // Check permissions
    if (userRole === "STUDENT" && existing.userId !== userId) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    // Validate date if provided
    if (data.date && isBefore(data.date, new Date())) {
      throw new AppError("Appointment date must be in the future", 400, "INVALID_DATE");
    }

    // Check doctor availability if changing date/doctor
    if ((data.date || data.doctorId) && existing.doctorId) {
      const doctorId = data.doctorId || existing.doctorId;
      const appointmentDate = data.date || existing.date;

      const isAvailable = await this.checkDoctorAvailability(
        doctorId,
        appointmentDate,
        existing.duration,
        id // Exclude current appointment
      );

      if (!isAvailable) {
        throw new AppError(
          "Doctor is not available at this time",
          409,
          "DOCTOR_UNAVAILABLE"
        );
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(data.date && { date: data.date }),
        ...(data.status && { status: data.status }),
        ...(data.reason !== undefined && { reason: data.reason }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.doctorId && { doctorId: data.doctorId }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    logger.info({ appointmentId: id }, "Appointment updated");

    return updated;
  }

  /**
   * Delete appointment
   */
  async deleteAppointment(id: string, userRole: string, userId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    }

    // Check permissions
    if (userRole === "STUDENT" && appointment.userId !== userId) {
      throw new AppError("Access denied", 403, "ACCESS_DENIED");
    }

    await prisma.appointment.delete({
      where: { id },
    });

    logger.info({ appointmentId: id }, "Appointment deleted");

    return { message: "Appointment deleted successfully" };
  }

  /**
   * Check if doctor is available at given time
   */
  async checkDoctorAvailability(
    doctorId: string,
    date: Date,
    duration: number,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const appointmentEnd = addMinutes(date, duration);

    const conflictingAppointments = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: {
          notIn: ["CANCELLED"],
        },
        ...(excludeAppointmentId && {
          id: { not: excludeAppointmentId },
        }),
        OR: [
          // Check if new appointment overlaps with existing
          {
            AND: [
              { date: { lte: date } },
              {
                date: {
                  gte: new Date(
                    date.getTime() - duration * 60 * 1000
                  ),
                },
              },
            ],
          },
          {
            AND: [
              { date: { gte: date } },
              { date: { lte: appointmentEnd } },
            ],
          },
        ],
      },
    });

    return !conflictingAppointments;
  }

  /**
   * Get available time slots for a doctor on a specific date
   */
  async getAvailableSlots(
    doctorId: string,
    date: string,
    duration?: number
  ): Promise<AvailableSlot[]> {
    const selectedDate = new Date(date);
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    // Get existing appointments for the day
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          notIn: ["CANCELLED"],
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Generate time slots (30-minute intervals from 8 AM to 5 PM)
    const slots: AvailableSlot[] = [];
    const slotDuration = duration || 30;
    const startHour = 8;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour, minute, 0, 0);

        // Skip past times
        if (isBefore(slotTime, new Date())) {
          continue;
        }

        const slotEnd = addMinutes(slotTime, slotDuration);

        // Check if slot conflicts with existing appointments
        const isAvailable = !appointments.some((apt) => {
          const aptEnd = addMinutes(apt.date, apt.duration);
          return (
            (isAfter(slotTime, apt.date) && isBefore(slotTime, aptEnd)) ||
            (isAfter(slotEnd, apt.date) && isBefore(slotEnd, aptEnd)) ||
            (isBefore(slotTime, apt.date) && isAfter(slotEnd, aptEnd))
          );
        });

        slots.push({
          date: date.split("T")[0],
          time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          available: isAvailable,
        });
      }
    }

    return slots;
  }
}

export const appointmentsService = new AppointmentsService();

