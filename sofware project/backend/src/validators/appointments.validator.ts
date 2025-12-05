import { z } from "zod";

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().optional(),
    serviceId: z.string().optional(),
    date: z.string().datetime(),
    duration: z.number().int().min(15).max(240).optional().default(30),
    reason: z.string().max(1000).optional(),
    notes: z.string().max(2000).optional(),
  }),
});

export const updateAppointmentSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  body: z.object({
    date: z.string().datetime().optional(),
    status: z
      .enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"])
      .optional(),
    reason: z.string().max(1000).optional(),
    notes: z.string().max(2000).optional(),
    doctorId: z.string().optional(),
  }),
});

export const getAppointmentsQuerySchema = z.object({
  query: z.object({
    status: z
      .enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"])
      .optional(),
    doctorId: z.string().cuid().optional(),
    userId: z.string().cuid().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

