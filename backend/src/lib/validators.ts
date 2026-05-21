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
    id: z.string(),
});
