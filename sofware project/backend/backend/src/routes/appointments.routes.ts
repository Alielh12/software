import { Router } from "express";
import { appointmentController } from "../controllers/appointments.controller";
import { authenticateToken, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validation";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentsQuerySchema,
} from "../validators/appointments.validator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management endpoints
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED]
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get(
  "/",
  authenticateToken,
  validate(getAppointmentsQuerySchema),
  appointmentController.getAppointments
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", authenticateToken, appointmentController.getAppointmentById);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  authenticateToken,
  validate(createAppointmentSchema),
  appointmentController.createAppointment
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Update appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  authenticateToken,
  validate(updateAppointmentSchema),
  appointmentController.updateAppointment
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Delete appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authenticateToken, appointmentController.deleteAppointment);

/**
 * @swagger
 * /api/appointments/available-slots:
 *   get:
 *     summary: Get available time slots for a doctor
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/available-slots",
  authenticateToken,
  appointmentController.getAvailableSlots
);

export { router as appointmentRoutes };

