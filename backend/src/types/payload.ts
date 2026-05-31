import type z from "zod";
import type { createBookingSchema, createBusinessSchema, createServiceSchema, manageBookingSchema, rescheduleBookingSchema, updateBusinessSchema, updateServiceSchema, userSchema } from "@/lib/validators";

export type UpdateUserPayload = z.infer<typeof userSchema>;

export type CreateBusinessPayload = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessPayload = z.infer<typeof updateBusinessSchema>;

export type CreateBookingPayload = z.infer<typeof createBookingSchema>;

export type CreateServicePayload = z.infer<typeof createServiceSchema>;
export type UpdateServicePayload = z.infer<typeof updateServiceSchema>;

export type BookingStatusUpdate = z.infer<typeof manageBookingSchema>["newStatus"];
export type RescheduleBookingPayload = z.infer<typeof rescheduleBookingSchema>;
