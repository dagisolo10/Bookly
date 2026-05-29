import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { CreateBookingPayload } from "@/types/payload";
import { fullBookingIncludes, type FullBooking } from "@/types/populated";
import type { ServiceResult } from "@/types/response";
import { hasEnoughTime, isBusinessOpen, isScheduleValid } from "@/utils/date-validator";
import { Prisma } from "@prisma/client";

export async function createBooking(data: CreateBookingPayload): ServiceResult<FullBooking> {
    try {
        const userId = getUserId();
        const { serviceId, startsAt } = data;

        const business = await prisma.business.findFirst({
            where: { services: { some: { id: serviceId } } },
            include: { hours: true },
        });

        if (!business) {
            return { error: "The selected business couldn't be found.", code: 404 };
        }

        if (business.status !== "Active") {
            return { error: "This business is currently not accepting bookings.", code: 400 };
        }

        const isOpen = isBusinessOpen(startsAt, business.hours, );

        if (!isOpen) {
            return { error: `This business is closed during the selected time. Please pick another slot.`, code: 400 };
        }

        const service = await prisma.service.findFirst({ where: { id: serviceId } });

        if (!service) {
            return { error: "The selected service couldn't be found.", code: 404 };
        }

        const enoughTime = hasEnoughTime(startsAt, business.hours, service.durationInMinutes, );

        if (!enoughTime) {
            return { error: "The selected time doesn't leave enough time before closing. Please choose an earlier slot.", code: 400 };
        }

        const activeBookings = await prisma.booking.findMany({
            where: { userId, status: { not: "Cancelled" } },
            select: {
                startsAt: true,
                service: {
                    select: { durationInMinutes: true },
                },
            },
        });

        const isValid = isScheduleValid(
            startsAt,
            service.durationInMinutes,
            activeBookings.map((b) => ({
                startsAt: b.startsAt,
                durationInMinutes: b.service.durationInMinutes,
            })),
        );

        if (!isValid) {
            return { error: "You have overlapping booking. Select another time", code: 400 };
        }

        const booking = await prisma.booking.create({
            data: {
                userId,
                startsAt,
                serviceId,
            },
            include: fullBookingIncludes,
        });

        return booking;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "That time slot is already booked. Please choose another time.", code: 409 };
        }
        console.error("Error in createBooking:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getMyBookings(): ServiceResult<FullBooking[]> {
    try {
        const userId = getUserId();

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: fullBookingIncludes,
            orderBy: {
                startsAt: "asc",
            },
        });

        return bookings;
    } catch (error) {
        console.error("Error in getMyBookings:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getBookingById(id: string): ServiceResult<FullBooking> {
    try {
        const userId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: { id, userId },
            include: fullBookingIncludes,
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        return booking;
    } catch (error) {
        console.error("Error in getBookingById:", error);
        return { error: "Internal server error", code: 500 };
    }
}
