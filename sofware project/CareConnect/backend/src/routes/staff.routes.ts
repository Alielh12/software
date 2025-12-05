import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth";
import { getStaffDashboard, getTeamSchedule } from "../controllers/staff.controller";

const router = Router();

router.get("/dashboard", authenticate, requireRole(["staff", "admin"]), getStaffDashboard);
router.get("/schedule", authenticate, requireRole(["staff", "admin"]), getTeamSchedule);

export default router;
