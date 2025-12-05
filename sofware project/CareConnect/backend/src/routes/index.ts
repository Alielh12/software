import { Router } from "express";
import studentRouter from "./student.routes";
import staffRouter from "./staff.routes";
import appointmentRouter from "./appointment.routes";

const router = Router();

router.use("/students", studentRouter);
router.use("/staff", staffRouter);
router.use("/appointments", appointmentRouter);

export default router;
