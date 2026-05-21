import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { BookingStatus, Prisma } from "@prisma/client";

type BookingStatusUpdate  = "Confirmed" | "Cancelled" | "Completed";

const fullBookingIncludes = {
    user: true,
    service: true,
} satisfies Prisma.BookingInclude;

const bookingCheck = (id: string, ownerId: string): Prisma.BookingWhereInput => ({
    id,
    service: {
        business: {
            ownerId,
        },
    },
});
export async function getBusinessBookings(businessId: string) {
    try {
        const ownerId = getUserId();

        const bookings = await prisma.booking.findMany({
            where: {
                service: {
                    business: {
                        id: businessId,
                        ownerId,
                    },
                },
            },
            include: fullBookingIncludes,
            orderBy: {
                startsAt: "asc",
            },
        });

        return bookings;
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getBookingById(id: string) {
    try {
        const ownerId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: bookingCheck(id, ownerId),
            include: fullBookingIncludes,
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        return booking;
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function manageBooking(id: string, newStatus: BookingStatusUpdate ) {
    try {
        const ownerId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: bookingCheck(id, ownerId),
            include: fullBookingIncludes,
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        if (booking.status === newStatus) {
            return booking;
        }

        const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
            Pending: ["Confirmed", "Cancelled"],
            Confirmed: ["Cancelled", "Completed"],
            Cancelled: [],
            Completed: [],
        };

        if (!allowedTransitions[booking.status].includes(newStatus)) {
            return { error: "This booking can't be changed to that status.", code: 400 };
        }

        const updatedBooking = await prisma.booking.update({
            where: {
                id,
            },
            data: {
                status: newStatus,
            },
            include: fullBookingIncludes,
        });

        return updatedBooking;
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}
