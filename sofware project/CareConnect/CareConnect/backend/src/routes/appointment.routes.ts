import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { listAppointments, createAppointment } from "../controllers/appointment.controller";

const router = Router();

router.get("/", authenticate, listAppointments);
router.post("/", authenticate, createAppointment);

export default router;
