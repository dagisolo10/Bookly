import z from "zod";
import { BusinessHour } from "@/types/models";

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

export function validateBusinessHours(data: unknown): BusinessHour {
    return BusinessHoursSchema.parse(data);
}
