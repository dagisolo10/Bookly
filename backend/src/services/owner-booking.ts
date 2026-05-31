import prisma from "@/lib/prisma";
import { BookingError } from "@/types/error";
import { getUserId } from "@/lib/request-context";
import type { BookingStatusUpdate } from "@/types/payload";
import { Prisma, type BookingStatus } from "@prisma/client";
import { fullBookingIncludes, type FullBooking } from "@/types/populated";
import type { PaginatedData, ServiceMessage, ServiceResult } from "@/types/response";
import { hasEnoughTime, isBusinessOpen, isScheduleValid } from "@/utils/date-validator";

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
            totalPages,
            data: bookings,
        };
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getBookingStatusCounts(businessId: string): ServiceResult<Record<BookingFilterStatus, number>> {
    try {
        const ownerId = getUserId();

        const business = await prisma.business.findFirst({
            where: { id: businessId, ownerId },
        });

        if (!business) {
            return { error: "Business not found", code: 404 };
        }

        const where = {
            service: {
                business: {
                    id: businessId,
                    ownerId,
                },
            },
        } satisfies Prisma.BookingWhereInput;

        const [total, pending, confirmed, cancelled, completed] = await Promise.all([
            prisma.booking.count({ where }),
            prisma.booking.count({ where: { ...where, status: "Pending" } }),
            prisma.booking.count({ where: { ...where, status: "Confirmed" } }),
            prisma.booking.count({ where: { ...where, status: "Cancelled" } }),
            prisma.booking.count({ where: { ...where, status: "Completed" } }),
        ]);

        return {
            All: total,
            Pending: pending,
            Confirmed: confirmed,
            Cancelled: cancelled,
            Completed: completed,
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

        const { count } = await prisma.booking.updateMany({
            where: {
                id,
                status: booking.status,
            },
            data: {
                status: newStatus,
            },
        });

        if (count === 0) {
            return { error: "This booking can't be changed to that status.", code: 409 };
        }

        const updatedBooking = await prisma.booking.findFirst({
            where: { id },
            include: fullBookingIncludes,
        });

        return updatedBooking!;
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function rescheduleBooking(id: string, data: { suggestedStartsAt: string; rescheduleReason?: string }): ServiceResult<FullBooking> {
    try {
        const ownerId = getUserId();
        const { suggestedStartsAt, rescheduleReason } = data;

        const booking = await prisma.booking.findFirst({
            where: bookingCheck(id, ownerId),
            include: {
                service: {
                    include: {
                        business: {
                            include: {
                                hours: true,
                            },
                        },
                    },
                },
                user: true,
            },
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        if (booking.status === "Cancelled" || booking.status === "Completed") {
            return { error: "This booking can no longer be rescheduled.", code: 400 };
        }

        const now = new Date();
        const starts = new Date(suggestedStartsAt);

        if (booking.startsAt < now) {
            return { error: "You can't reschedule a past booking.", code: 400 };
        }

        if (starts < now) {
            return { error: "You can't choose a past time.", code: 400 };
        }

        const business = booking.service.business;

        if (business.status !== "Active") {
            return { error: "This business is currently not accepting bookings.", code: 400 };
        }

        const isOpen = isBusinessOpen(suggestedStartsAt, business.hours);

        if (!isOpen) {
            return { error: `This business is closed during the selected time. Please pick another slot.`, code: 400 };
        }

        const enoughTime = hasEnoughTime(suggestedStartsAt, business.hours, booking.bookedDuration);

        if (!enoughTime) {
            return { error: "The selected time doesn't leave enough time before closing. Please choose an earlier slot.", code: 400 };
        }

        if (!booking.service.isActive) {
            return { error: "This service is no longer available.", code: 400 };
        }

        const suggestedEndsAtInMs = starts.getTime() + booking.bookedDuration * 60 * 1000;
        const suggestedEndsAt = new Date(suggestedEndsAtInMs);

        const updatedBooking = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT 1 FROM "Business" WHERE id = ${booking.service.businessId} FOR UPDATE`;
            await tx.$queryRaw`SELECT 1 FROM "User" WHERE id = ${booking.userId} FOR UPDATE`;

            const businessBookings = await tx.booking.findMany({
                where: {
                    service: {
                        businessId: booking.service.businessId,
                    },
                    status: {
                        in: ["Pending", "Confirmed"],
                    },
                    NOT: { id: booking.id },
                },
                select: {
                    startsAt: true,
                    endsAt: true,
                },
            });

            const isBusinessBookingValid = isScheduleValid(
                suggestedStartsAt,
                booking.bookedDuration,
                businessBookings.map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt })),
            );

            if (!isBusinessBookingValid) {
                throw new BookingError("That time slot is already booked. Please choose another time.", 409);
            }

            const customerBookings = await tx.booking.findMany({
                where: {
                    userId: booking.userId,
                    status: {
                        in: ["Pending", "Confirmed"],
                    },
                    NOT: { id: booking.id },
                },
            });

            const isCustomerBookingValid = isScheduleValid(
                suggestedStartsAt,
                booking.bookedDuration,
                customerBookings.map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt })),
            );

            if (!isCustomerBookingValid) {
                throw new BookingError("Customer has overlapping booking. Select another time", 409);
            }

            const { count } = await tx.booking.updateMany({
                where: {
                    id: booking.id,
                    status: { notIn: ["Cancelled", "Completed"] },
                    startsAt: booking.startsAt,
                },
                data: {
                    suggestedEndsAt,
                    rescheduleReason,
                    status: "Pending",
                    suggestedBy: "Owner",
                    suggestedStartsAt: starts,
                },
            });

            if (count === 0) {
                throw new BookingError("This booking can no longer be rescheduled.", 409);
            }

            return tx.booking.findUnique({
                where: { id: booking.id },
                include: fullBookingIncludes,
            }) as unknown as FullBooking;
        });

        return updatedBooking;
    } catch (error) {
        if (error instanceof BookingError) {
            return { error: error.message, code: error.code };
        }
        console.error("Error in rescheduleBooking:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function acceptRescheduleBooking(id: string): ServiceResult<FullBooking> {
    try {
        const ownerId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: bookingCheck(id, ownerId),
            include: {
                service: {
                    include: {
                        business: {
                            include: { hours: true },
                        },
                    },
                },
                user: true,
            },
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        if (!booking.suggestedStartsAt || !booking.suggestedEndsAt) {
            return { error: "No reschedule request is pending for this booking.", code: 400 };
        }

        if (booking.status === "Cancelled" || booking.status === "Completed") {
            return { error: "This booking can no longer be rescheduled.", code: 400 };
        }

        const startsAt = booking.suggestedStartsAt;
        const endsAt = booking.suggestedEndsAt;
        const duration = booking.bookedDuration;
        const businessId = booking.service.businessId;

        const updatedBooking = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT 1 FROM "Business" WHERE id = ${businessId} FOR UPDATE`;
            await tx.$queryRaw`SELECT 1 FROM "User" WHERE id = ${booking.userId} FOR UPDATE`;

            const businessBookings = await tx.booking.findMany({
                where: {
                    service: { businessId },
                    status: { in: ["Pending", "Confirmed"] },
                    NOT: { id: booking.id },
                },
                select: { startsAt: true, endsAt: true },
            });

            const isBusinessBookingValid = isScheduleValid(
                startsAt.toISOString(),
                duration,
                businessBookings.map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt })),
            );

            if (!isBusinessBookingValid) {
                throw new BookingError("That time slot is now taken. Please contact the customer.", 409);
            }

            const customerBookings = await tx.booking.findMany({
                where: {
                    userId: booking.userId,
                    status: { in: ["Pending", "Confirmed"] },
                    NOT: { id: booking.id },
                },
            });

            const isCustomerBookingValid = isScheduleValid(
                startsAt.toISOString(),
                duration,
                customerBookings.map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt })),
            );

            if (!isCustomerBookingValid) {
                throw new BookingError("Customer has an overlapping booking at this new time.", 409);
            }

            return tx.booking.update({
                where: { id: booking.id },
                data: {
                    endsAt,
                    startsAt,
                    status: "Confirmed",
                    suggestedBy: null,
                    suggestedEndsAt: null,
                    suggestedStartsAt: null,
                },
                include: fullBookingIncludes,
            });
        });

        return updatedBooking;
    } catch (error) {
        if (error instanceof BookingError) {
            return { error: error.message, code: error.code };
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "That time slot is now taken. Please contact the customer.", code: 409 };
        }
        console.error("Error in acceptRescheduleBooking:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function declineRescheduleBooking(id: string): ServiceResult<ServiceMessage> {
    try {
        const ownerId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: bookingCheck(id, ownerId),
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        if (!booking.suggestedStartsAt) {
            return { error: "No reschedule request is pending for this booking.", code: 400 };
        }

        const { count } = await prisma.booking.updateMany({
            where: {
                id,
                suggestedStartsAt: { not: null },
            },
            data: {
                suggestedBy: null,
                suggestedEndsAt: null,
                rescheduleReason: null,
                suggestedStartsAt: null,
            },
        });

        if (count === 0) {
            return { error: "No reschedule request is pending for this booking.", code: 409 };
        }

        return { message: "Reschedule request declined." };
    } catch (error) {
        console.error("Error in declineRescheduleBooking:", error);
        return { error: "Internal server error", code: 500 };
    }
}
