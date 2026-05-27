import type { BusinessHour } from "@prisma/client";

export function isScheduleValid(newStart: string, newDuration: number, existingIntervals: { startsAt: Date; durationInMinutes: number }[]): boolean {
    const endsAt = (date: Date) => date.getTime() + newDuration * 60 * 1000;

    const newSchedule = new Date(newStart);
    const newStartMs = newSchedule.getTime();
    const newEndMs = endsAt(newSchedule);

    return existingIntervals.every(({ durationInMinutes, startsAt }) => {
        const activeStartMs = startsAt.getTime();
        const activeEndMs = activeStartMs + durationInMinutes * 60 * 1000;

        const hasOverlap = newEndMs > activeStartMs && newStartMs < activeEndMs;
        return !hasOverlap;
    });
}

function getLocalizedTimeParts(dateStr: string, timeZone: string) {
    const date = new Date(dateStr);

    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(date);

    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone,
    });

    const parts = formatter.formatToParts(date);
    const hour = parts.find((p) => p.type === "hour")?.value || "00";
    const minute = parts.find((p) => p.type === "minute")?.value || "00";

    return { weekday, hour: Number(hour), minute: Number(minute) };
}

export function isBusinessOpen(date: string, hours: BusinessHour[], timeZone: string): boolean {
    const { weekday, hour, minute } = getLocalizedTimeParts(date, timeZone);

    const day = hours.find((hour) => hour.day === weekday);

    if (!day) return false;

    const bookingTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    return bookingTime >= day.open && bookingTime < day.close;
}

export function hasEnoughTime(date: string, hours: BusinessHour[], duration: number, timeZone: string): boolean {
    const { weekday, hour, minute } = getLocalizedTimeParts(date, timeZone);

    const day = hours.find((hour) => hour.day === weekday);

    if (!day) return false;

    const [cHour, cMin] = day.close.split(":").map(Number);
    const closingInMinutes = (cHour ?? 0) * 60 + (cMin ?? 0);

    const bookingInMinutes = hour * 60 + minute;

    return bookingInMinutes + duration <= closingInMinutes;
}
