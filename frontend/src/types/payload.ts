import { createBusinessSchema, updateBusinessSchema, createServiceSchema, updateServiceSchema } from "@/lib/validation";
import z from "zod";

export type UserPayload = { name: string };

export type CreateBusinessPayload = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessPayload = z.infer<typeof updateBusinessSchema>;

export type CreateServicePayload = z.infer<typeof createServiceSchema>;
export type UpdateServicePayload = z.infer<typeof updateServiceSchema>;

export type BookingStatusUpdate = "Confirmed" | "Cancelled" | "Completed";
