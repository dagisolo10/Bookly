import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { BookingStatusUpdate } from "@/types/payload";
import { Prisma, type BookingStatus } from "@prisma/client";
import type { PaginatedData, ServiceResult } from "@/types/response";
import { fullBookingIncludes, type FullBooking } from "@/types/populated";

export type BookingFilterStatus = BookingStatus | "All";

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Cancelled", "Completed"],
    Cancelled: [],
    Completed: [],
};

const bookingCheck = (id: string, ownerId: string): Prisma.BookingWhereInput => ({
    id,
    service: {
        business: {
            ownerId,
        },
    },
});

export async function getBusinessBookings(businessId: string, page: number, limit: number, query: string, status: BookingFilterStatus): ServiceResult<PaginatedData<FullBooking>> {
    try {
        const ownerId = getUserId();
        const queryWhere = {
            service: {
                business: {
                    id: businessId,
                    ownerId,
                },
            },
            ...(status && status !== "All" && { status }),
            ...(query && {
                OR: [
                    {
                        bookedServiceName: {
                            contains: query,
                            mode: Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        user: {
                            name: {
                                contains: query,
                                mode: Prisma.QueryMode.insensitive,
                            },
                        },
                    },
                ],
            }),
        } satisfies Prisma.BookingWhereInput;

        const business = await prisma.business.findFirst({
            where: {
                id: businessId,
                ownerId,
            },
        });

        if (!business) {
            return { error: "Business not found", code: 404 };
        }

        const [total, bookings] = await Promise.all([
            prisma.booking.count({ where: queryWhere }),
            prisma.booking.findMany({
                where: queryWhere,
                take: limit,
                skip: (page - 1) * limit,
                include: fullBookingIncludes,
                orderBy: { startsAt: "asc" },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        return {
            total,
            hasMore,
            totalPages: totalPages || 1,
            data: bookings,
        };
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getBookingById(id: string): ServiceResult<FullBooking> {
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

export async function manageBooking(id: string, newStatus: BookingStatusUpdate): ServiceResult<FullBooking> {
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
