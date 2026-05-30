import type { BusinessHour } from "@prisma/client";

export function isScheduleValid(newStart: string, newDuration: number, existingIntervals: { startsAt: Date; endsAt: Date }[]): boolean {
    const newSchedule = new Date(newStart);
    const newStartMs = newSchedule.getTime();
    const newEndMs = newStartMs + newDuration * 60 * 1000;

    return existingIntervals.every(({ startsAt, endsAt }) => {
        const activeEndMs = endsAt.getTime();
        const activeStartMs = startsAt.getTime();

        const hasOverlap = newEndMs > activeStartMs && newStartMs < activeEndMs;
        return !hasOverlap;
    });
}

function getLocalizedTimeParts(dateStr: string) {
    const date = new Date(dateStr);

    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);

    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const hour = parts.find((p) => p.type === "hour")?.value || "00";
    const minute = parts.find((p) => p.type === "minute")?.value || "00";

    return { weekday, hour: Number(hour), minute: Number(minute) };
}

export function isBusinessOpen(date: string, hours: BusinessHour[]): boolean {
    const { weekday, hour, minute } = getLocalizedTimeParts(date);

    const day = hours.find((hour) => hour.day === weekday);

    if (!day) return false;

    const bookingTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    return bookingTime >= day.open && bookingTime < day.close;
}

export function hasEnoughTime(date: string, hours: BusinessHour[], duration: number): boolean {
    const { weekday, hour, minute } = getLocalizedTimeParts(date);

    const day = hours.find((hour) => hour.day === weekday);

    if (!day) return false;

    const [cHour, cMin] = day.close.split(":").map(Number);
    const closingInMinutes = (cHour ?? 0) * 60 + (cMin ?? 0);

    const bookingInMinutes = hour * 60 + minute;

    return bookingInMinutes + duration <= closingInMinutes;
}
