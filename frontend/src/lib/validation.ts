import z from "zod";

export const BusinessHoursSchema = z
    .object({
        id: z.string(),
        open: z.iso.time("Invalid time format"),
        close: z.iso.time("Invalid time format"),
        day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
        businessId: z.string(),
    })
    .refine(({ open, close }) => open < close, {
        message: "Closing time must be after opening time",
    });

export function validateBusinessHours(data: unknown): z.infer<typeof BusinessHoursSchema> {
    return BusinessHoursSchema.parse(data);
}

const DayHoursSchema = z
    .object({ open: z.iso.time("Invalid time format (HH:MM)"), close: z.iso.time("Invalid time format (HH:MM)"), day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "Can only accept week days") })
    .refine(({ open, close }) => open < close, { message: "Closing time must be after opening time" });

export const createBusinessSchema = z.object({
    name: z.string().min(1, "Business name is required"),
    phone: z.string().nullish(),
    location: z.string().nullish(),
    description: z.string().nullish(),
    timeZone: z.string().min(1, "Timezone is required"),
    bannerImages: z.array(z.string().url("Invalid banner image URL")),
    hours: z.array(DayHoursSchema).min(1, "At least one open day is required"),
});

export const updateBusinessSchema = z.object({
    name: z.string().min(1, "Business name is required").optional(),
    phone: z.string().nullish(),
    location: z.string().nullish(),
    description: z.string().nullish(),
    timeZone: z.string().min(1, "Timezone is required").optional(),
    bannerImages: z.array(z.string().url("Invalid banner image URL")).optional(),
    hours: z.array(DayHoursSchema).min(1, "At least one open day is required"),
});

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

export const createBookingSchema = z.object({
    startsAt: z.iso.datetime({ message: "Invalid date format" }),
    serviceId: z.string().cuid(),
});
