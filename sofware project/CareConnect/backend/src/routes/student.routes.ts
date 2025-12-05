import { Router } from "express";
import { listStudents, getStudentProfile } from "../controllers/student.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, listStudents);
router.get("/:id", authenticate, getStudentProfile);

export default router;
