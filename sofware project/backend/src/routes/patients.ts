import { Router, Response } from "express";
import prisma from "../config/database";
import { authenticateToken, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all patients (staff only)
router.get(
  "/",
  authenticateToken,
  requireRole("DOCTOR", "NURSE", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const patients = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
        },
        orderBy: { lastName: "asc" },
      });

      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  }
);

// Get patient records
router.get(
  "/:id/records",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const patientId = req.params.id;
      const isOwner = req.user!.id === patientId;
      const isStaff = ["DOCTOR", "NURSE", "ADMIN"].includes(req.user!.role);

      if (!isOwner && !isStaff) {
        return res.status(403).json({ error: "Access denied" });
      }

      const records = await prisma.patientRecord.findMany({
        where: { userId: patientId },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch records" });
    }
  }
);

export const patientRoutes = router;

