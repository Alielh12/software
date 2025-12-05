import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import { appointmentsService } from "../services/appointments.service";
import { AppError } from "../middlewares/errorHandler";

class AppointmentController {
  /**
   * Get all appointments
   */
  async getAppointments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        userId: req.query.userId as string | undefined,
        doctorId: req.query.doctorId as string | undefined,
        status: req.query.status as string | undefined,
        startDate: req.query.startDate
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: req.query.endDate
          ? new Date(req.query.endDate as string)
          : undefined,
      };

      const appointments = await appointmentsService.getAppointments(
        filters,
        req.user!.role,
        req.user!.id
      );

      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentsService.getAppointmentById(
        req.params.id,
        req.user!.role,
        req.user!.id
      );

      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new appointment
   */
  async createAppointment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentsService.createAppointment({
        userId: req.user!.id,
        doctorId: req.body.doctorId,
        serviceId: req.body.serviceId,
        date: new Date(req.body.date),
        duration: req.body.duration,
        reason: req.body.reason,
        notes: req.body.notes,
      });

      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update appointment
   */
  async updateAppointment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentsService.updateAppointment(
        req.params.id,
        {
          ...(req.body.date && { date: new Date(req.body.date) }),
          status: req.body.status,
          reason: req.body.reason,
          notes: req.body.notes,
          doctorId: req.body.doctorId,
        },
        req.user!.role,
        req.user!.id
      );

      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete appointment
   */
  async deleteAppointment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await appointmentsService.deleteAppointment(
        req.params.id,
        req.user!.role,
        req.user!.id
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get available time slots
   */
  async getAvailableSlots(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { doctorId, date, duration } = req.query;

      if (!doctorId || !date) {
        throw new AppError(
          "doctorId and date are required",
          400,
          "MISSING_PARAMETERS"
        );
      }

      const slots = await appointmentsService.getAvailableSlots(
        doctorId as string,
        date as string,
        duration ? parseInt(duration as string) : undefined
      );

      res.json(slots);
    } catch (error) {
      next(error);
    }
  }
}

export const appointmentController = new AppointmentController();

