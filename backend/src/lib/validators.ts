import { z } from "zod";

/**
 * User Schema
 */

export const userSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters."),
        phone: z.string().nullish(),
    })
    .strict();

/**
 * Business Schema
 */

const DayHoursSchema = z
    .object({ open: z.iso.time("Invalid time format"), close: z.iso.time("Invalid time format"), day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "Can only accept week days") })
    .refine(({ open, close }) => open < close, { message: "Closing time must be after opening time" });

export const createBusinessSchema = z
    .object({
        name: z.string().min(1, "Business name is required"),
        hours: z.preprocess(
            (val) => {
                if (typeof val === "string") {
                    try {
                        return JSON.parse(val);
                    } catch {
                        return val;
                    }
                }
                return val;
            },
            z.array(DayHoursSchema).min(1, "At least one open day is required"),
        ),
        phone: z.string().nullish(),
        location: z.string().nullish(),
        description: z.string().nullish(),
    })
    .refine(
        (data) => {
            const days = data.hours.map((h) => h.day);
            return new Set(days).size === days.length;
        },
        { message: "Duplicate weekdays are not allowed", path: ["hours"] },
    );

export const updateBusinessSchema = z.object({
    name: z.string().min(1, "Business name is required").optional(),
    hours: z
        .preprocess(
            (val) => {
                if (typeof val === "string") {
                    try {
                        return JSON.parse(val);
                    } catch {
                        return val;
                    }
                }
                return val;
            },
            z.array(DayHoursSchema).min(1, "At least one open day is required"),
        )
        .optional(),
    phone: z.string().nullish(),
    location: z.string().nullish(),
    description: z.string().nullish(),
    removedBannerImages: z.array(z.string().url()).optional(),
});

export const businessIdSchema = z.object({ id: z.string().min(1, "Business Id is required") });

/**
 * Service Schema
 */

export const createServiceSchema = z.object({
    name: z.string().min(1, "Service name is required"),
    durationInMinutes: z.number().int().positive("Duration must be positive"),
    price: z.number().positive("Price must be positive"),
    businessId: z.string().min(1, "Business Id is required"),
    thumbnail: z.string().nullish(),
    category: z.string().default("Other"),
});

export const updateServiceSchema = z.object({
    name: z.string().min(1, "Service name is required").optional(),
    durationInMinutes: z.number().int().positive("Duration must be positive").optional(),
    price: z.number().positive("Price must be positive").optional(),
    thumbnail: z.string().nullish(),
    category: z.string().optional(),
});

export const serviceIdSchema = z.object({ id: z.string().min(1, "Service Id is required") });

export const serviceBusinessIdSchema = z.object({ businessId: z.string().min(1, "Business Id is required") });

/**
 * Pagination Schema
 */

export const paginationQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .default("1")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().positive("Page must be greater than 0")),
    limit: z
        .string()
        .optional()
        .default("10")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().positive("Limit must be greater than 0").max(100, "Limit cannot exceed 100")),
});

export const querySearchSchema = z.object({ query: z.string().optional().default("") });
export const statusSearchSchema = z.object({
    status: z.enum(["Pending", "Confirmed", "Cancelled", "Completed", "All"]).optional().default("All"),
});

/**
 *  Booking Schema
 */

export const bookingIdSchema = z.object({ id: z.string().min(1, "Booking Id is required") });
export const manageBookingSchema = z.object({ newStatus: z.enum(["Confirmed", "Cancelled", "Completed"]) });
export const bookingBusinessIdSchema = z.object({ businessId: z.string().min(1, "Business Id is required") });

export const createBookingSchema = z.object({
    startsAt: z.iso.datetime({ message: "Invalid date format" }),
    serviceId: z.string().cuid(),
});
