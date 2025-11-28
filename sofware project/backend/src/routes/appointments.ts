import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import prisma from "../config/database";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// Get all appointments (user's own or all if admin/doctor)
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const isStaff = ["DOCTOR", "NURSE", "ADMIN"].includes(req.user!.role);
    const where = isStaff ? {} : { userId: req.user!.id };

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
      orderBy: { date: "desc" },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Create appointment
router.post(
  "/",
  authenticateToken,
  [
    body("date").isISO8601(),
    body("reason").optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const appointment = await prisma.appointment.create({
        data: {
          userId: req.user!.id,
          date: new Date(req.body.date),
          reason: req.body.reason,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create appointment" });
    }
  }
);

export const appointmentRoutes = router;

