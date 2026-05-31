"use client";

import { dayOrder } from "@/constants/time";
import { generateTimeSlots } from "@/lib/helpers/time";
import { BusinessHour } from "@/types/models";
import { useMemo } from "react";

interface useAvailableTimeSlotsProps {
    date?: Date;
    duration?: number;
    hours?: BusinessHour[];
}

export default function useAvailableTimeSlots({ date, duration, hours }: useAvailableTimeSlotsProps) {
    const weekday = date ? dayOrder[date.getDay()] : null;

    const isOpenDay = useMemo(() => {
        if (!weekday || !hours) return false;

        return hours.some((h) => h.day === weekday);
    }, [weekday, hours]);

    const availableTimeSlots = useMemo(() => {
        if (!date || !hours || !duration) return [];

        const weekday = dayOrder[date.getDay()];
        const dayHours = hours.find((h) => h.day === weekday);

        if (!dayHours) return [];

        const slots = generateTimeSlots(dayHours.open, dayHours.close, duration, 30);

        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (!isToday) return slots;

        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        return slots.filter((s) => {
            const [h, m] = s.split(":").map(Number);
            return (h ?? 0) * 60 + (m ?? 0) > nowMinutes;
        });
    }, [date, duration, hours]);

    return { availableTimeSlots, isOpenDay };
}
