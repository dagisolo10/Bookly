import { z } from "zod";

/**
 * User Schema
 */

export const userSchema = z.object({ name: z.string().min(3, "Name must be at least 3 characters.") }).strict();

/**
 * Business Schema
 */

const WeeDaysSchema = z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "Can only accept week days");

const DayHoursSchema = z
    .object({
        open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
        close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
        day: WeeDaysSchema,
    })
    .refine(({ open, close }) => open < close, {
        message: "Closing time must be after opening time",
    });

export const createBusinessSchema = z
    .object({
        name: z.string().min(1, "Business name is required"),
        hours: z.array(DayHoursSchema),
        phone: z.string().optional().nullable(),
        location: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        bannerImages: z.array(z.string()).default([]),
        timeZone: z.string(),
    })
    .refine(
        (data) => {
            const days = data.hours.map((h) => h.day);
            return new Set(days).size === days.length;
        },
        {
            message: "Duplicate weekdays are not allowed",
            path: ["hours"],
        },
    );

export const updateBusinessSchema = z.object({
    name: z.string().min(1, "Business name is required").optional(),
    hours: z.array(DayHoursSchema).optional(),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    bannerImages: z.array(z.string()).optional(),
    timeZone: z.string().optional(),
});

export const businessIdSchema = z.object({
    id: z.string().min(1, "Business Id is required"),
});

/**
 * Service Schema
 */

export const createServiceSchema = z.object({
    name: z.string().min(1, "Service name is required"),
    durationInMinutes: z.number().int().positive("Duration must be positive"),
    price: z.number().positive("Price must be positive"),
    businessId: z.string().min(1, "Business Id is required"),
    thumbnail: z.string().optional().nullable(),
    category: z.string().default("Other"),
});

export const updateServiceSchema = z.object({
    name: z.string().min(1, "Service name is required").optional(),
    durationInMinutes: z.number().int().positive("Duration must be positive").optional(),
    price: z.number().positive("Price must be positive").optional(),
    thumbnail: z.string().optional().nullable(),
    category: z.string().optional(),
});

export const serviceIdSchema = z.object({
    id: z.string().min(1, "Service Id is required"),
});

/**
 * Booking Schema
 */

export const manageBookingSchema = z.object({
    newStatus: z.enum(["Confirmed", "Cancelled", "Completed"]),
});

export const bookingIdSchema = z.object({
    id: z.string().min(1, "Booking Id is required"),
});

export const bookingBusinessIdSchema = z.object({
    businessId: z.string().min(1, "Business Id is required"),
});
