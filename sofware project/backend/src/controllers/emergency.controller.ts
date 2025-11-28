import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import { emergencyService } from "../services/emergency.service";

class EmergencyController {
  async createEmergencyRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const emergency = await emergencyService.createRequest({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(emergency);
    } catch (error) {
      next(error);
    }
  }

  async getEmergencyRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const emergencies = await emergencyService.getRequests(
        req.user!.role,
        req.query.status as string | undefined
      );
      res.json(emergencies);
    } catch (error) {
      next(error);
    }
  }

  async getEmergencyRequestById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const emergency = await emergencyService.getRequestById(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      res.json(emergency);
    } catch (error) {
      next(error);
    }
  }

  async assignStaff(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const emergency = await emergencyService.assignStaff(
        req.params.id,
        req.body.staffId,
        req.user!.id
      );
      res.json(emergency);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const emergency = await emergencyService.updateStatus(
        req.params.id,
        req.body.status,
        req.user!.id
      );
      res.json(emergency);
    } catch (error) {
      next(error);
    }
  }
}

export const emergencyController = new EmergencyController();

