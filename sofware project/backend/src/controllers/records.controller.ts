import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import { recordsService } from "../services/records.service";

class RecordsController {
  async getEncryptedRecord(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const record = await recordsService.getEncryptedRecord(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      res.json(record);
    } catch (error) {
      next(error);
    }
  }

  async getDecryptionKey(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const key = await recordsService.getDecryptionKey(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.query.keyId as string | undefined
      );
      res.json(key);
    } catch (error) {
      next(error);
    }
  }

  async verifyAccess(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const hasAccess = await recordsService.verifyAccess(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      res.json({ hasAccess });
    } catch (error) {
      next(error);
    }
  }

  async createRecord(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const record = await recordsService.createRecord({
        ...req.body,
        doctorId: req.user!.id,
      });
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  }

  async getRecords(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const records = await recordsService.getRecords(
        req.user!.id,
        req.user!.role
      );
      res.json(records);
    } catch (error) {
      next(error);
    }
  }

  async getRecordById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const record = await recordsService.getRecordById(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      res.json(record);
    } catch (error) {
      next(error);
    }
  }
}

export const recordsController = new RecordsController();

