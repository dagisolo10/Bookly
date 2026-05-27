import type { BusinessHour } from "@prisma/client";

export function isScheduleValid(date: string, duration: number, activeDates: Date[]): boolean {
    const endsAt = (date: Date) => date.getTime() + duration * 60 * 1000;

    const newSchedule = new Date(date);
    const newStartMs = newSchedule.getTime();
    const newEndMs = endsAt(newSchedule);

    return activeDates.every((active) => {
        const activeStartMs = new Date(active).getTime();
        const activeEndMs = endsAt(new Date(active));

        const hasOverlap = newEndMs > activeStartMs && newStartMs < activeEndMs;

        return !hasOverlap;
    });
}

export function isBusinessOpen(date: string, hours: BusinessHour[]): boolean {
    const bookingDate = new Date(date);
    const weekday = bookingDate.toLocaleDateString("en-US", { weekday: "long" });

    const day = hours.find((hour) => hour.day === weekday);

    if (!day) return false;

    const hour = bookingDate.getHours().toString().padStart(2, "0");
    const minute = bookingDate.getMinutes().toString().padStart(2, "0");
    const bookingTime = `${hour}:${minute}`;

    return bookingTime >= day.open && bookingTime < day.close;
}

export function hasEnoughTime(date: string, hours: BusinessHour[], duration: number): boolean {
    const bookingDate = new Date(date);
    const weekday = bookingDate.toLocaleDateString("en-US", { weekday: "long" });

    const day = hours.find((hour) => hour.day === weekday);

    if (!day) return false;

    const [cHour, cMin] = day.close.split(":").map(Number);
    const closingInMinutes = (cHour ?? 0) * 60 + (cMin ?? 0);
    const bookingInMinutes = bookingDate.getHours() * 60 + bookingDate.getMinutes();

    return bookingInMinutes + duration <= closingInMinutes;
}
