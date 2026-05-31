import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { BookingError } from "@/types/error";
import { getUserId } from "@/lib/request-context";
import { fullBookingIncludes, type FullBooking } from "@/types/populated";
import type { PaginatedData, ServiceMessage, ServiceResult } from "@/types/response";
import type { CreateBookingPayload, RescheduleBookingPayload } from "@/types/payload";
import { hasEnoughTime, isBusinessOpen, isScheduleValid } from "@/utils/date-validator";

async function checkBusinessBookingOverlap(tx: Prisma.TransactionClient, businessId: string, excludeBookingId: string | undefined, startsAt: string, duration: number): Promise<boolean> {
    await tx.$queryRaw`SELECT 1 FROM "Business" WHERE id = ${businessId} FOR UPDATE`;

    const where: Prisma.BookingWhereInput = {
        service: { businessId },
        status: { in: ["Pending", "Confirmed"] },
        ...(excludeBookingId ? { NOT: { id: excludeBookingId } } : {}),
    };

    const businessBookings = await tx.booking.findMany({
        where,
        select: { startsAt: true, endsAt: true },
    });

    return isScheduleValid(
        startsAt,
        duration,
        businessBookings.map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt })),
    );
}

async function checkCustomerBookingOverlap(tx: Prisma.TransactionClient, userId: string, excludeBookingId: string | undefined, startsAt: string, duration: number): Promise<boolean> {
    await tx.$queryRaw`SELECT 1 FROM "User" WHERE id = ${userId} FOR UPDATE`;

    const where: Prisma.BookingWhereInput = {
        userId,
        status: { not: "Cancelled" },
        ...(excludeBookingId ? { NOT: { id: excludeBookingId } } : {}),
    };

    const activeBookings = await tx.booking.findMany({
        where,
        select: { startsAt: true, endsAt: true },
    });

    return isScheduleValid(
        startsAt,
        duration,
        activeBookings.map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt })),
    );
}

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

        const isOpen = isBusinessOpen(startsAt, business.hours);

        if (!isOpen) {
            return { error: `This business is closed during the selected time. Please pick another slot.`, code: 400 };
        }

        const service = await prisma.service.findFirst({ where: { id: serviceId } });

        if (!service) {
            return { error: "The selected service couldn't be found.", code: 404 };
        }

        if (!service.isActive) {
            return { error: "This service is no longer available.", code: 400 };
        }

        const enoughTime = hasEnoughTime(startsAt, business.hours, service.durationInMinutes);

        if (!enoughTime) {
            return { error: "The selected time doesn't leave enough time before closing. Please choose an earlier slot.", code: 400 };
        }

        const endsAtInMs = new Date(startsAt).getTime() + service.durationInMinutes * 60 * 1000;
        const endsAt = new Date(endsAtInMs);

        const booking = await prisma.$transaction(async (tx) => {
            const businessOverlapValid = await checkBusinessBookingOverlap(tx, business.id, undefined, startsAt, service.durationInMinutes);
            if (!businessOverlapValid) {
                throw new BookingError("That time slot is already booked. Please choose another time.", 409);
            }

            const customerOverlapValid = await checkCustomerBookingOverlap(tx, userId, undefined, startsAt, service.durationInMinutes);
            if (!customerOverlapValid) {
                throw new BookingError("You have overlapping booking. Select another time", 409);
            }

            return tx.booking.create({
                data: {
                    userId,
                    endsAt,
                    startsAt,
                    serviceId,
                    bookedPrice: service.price,
                    bookedServiceName: service.name,
                    bookedCategory: service.category,
                    bookedThumbnail: service.thumbnail,
                    bookedDuration: service.durationInMinutes,
                },
                include: fullBookingIncludes,
            });
        });

        return booking;
    } catch (error) {
        if (error instanceof BookingError) {
            return { error: error.message, code: error.code };
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "That time slot is already booked. Please choose another time.", code: 409 };
        }
        console.error("Error in createBooking:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getMyBookings(page: number, limit: number, query?: string): ServiceResult<PaginatedData<FullBooking>> {
    try {
        const userId = getUserId();

        const where = {
            userId,
            ...(query && {
                service: {
                    name: { contains: query, mode: Prisma.QueryMode.insensitive },
                },
            }),
        } satisfies Prisma.BookingWhereInput;

        const [total, bookings] = await Promise.all([
            prisma.booking.count({ where }),
            prisma.booking.findMany({
                where,
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

export async function rescheduleBooking(id: string, data: RescheduleBookingPayload): ServiceResult<FullBooking> {
    try {
        const { startsAt } = data;

        const userId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: {
                id,
                userId,
            },
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
            },
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        if (booking.status === "Cancelled" || booking.status === "Completed") {
            return { error: "This booking can no longer be rescheduled.", code: 400 };
        }

        const now = new Date();

        if (booking.startsAt < now) {
            return { error: "You can't reschedule a past booking.", code: 400 };
        }

        const newDate = new Date(startsAt);

        if (newDate < now) {
            return { error: "You can't choose a past time.", code: 400 };
        }

        const business = booking.service.business;

        if (business.status !== "Active") {
            return { error: "This business is currently not accepting bookings.", code: 400 };
        }

        const isOpen = isBusinessOpen(startsAt, business.hours);

        if (!isOpen) {
            return { error: `This business is closed during the selected time. Please pick another slot.`, code: 400 };
        }

        const enoughTime = hasEnoughTime(startsAt, business.hours, booking.bookedDuration);

        if (!enoughTime) {
            return { error: "The selected time doesn't leave enough time before closing. Please choose an earlier slot.", code: 400 };
        }

        if (!booking.service.isActive) {
            return { error: "This service is no longer available.", code: 400 };
        }

        const endsAtInMs = new Date(startsAt).getTime() + booking.bookedDuration * 60 * 1000;
        const endsAt = new Date(endsAtInMs);

        const updatedBooking = await prisma.$transaction(async (tx) => {
            const businessOverlapValid = await checkBusinessBookingOverlap(tx, business.id, booking.id, startsAt, booking.bookedDuration);
            if (!businessOverlapValid) {
                throw new BookingError("That time slot is already booked. Please choose another time.", 409);
            }

            const customerOverlapValid = await checkCustomerBookingOverlap(tx, userId, booking.id, startsAt, booking.bookedDuration);
            if (!customerOverlapValid) {
                throw new BookingError("You have overlapping booking. Select another time", 409);
            }

            const { count } = await tx.booking.updateMany({
                where: {
                    id: booking.id,
                    status: { notIn: ["Cancelled", "Completed"] },
                    startsAt: booking.startsAt,
                },
                data: {
                    status: "Pending",
                    rescheduleReason: null,
                    suggestedBy: "Customer",
                    suggestedEndsAt: endsAt,
                    suggestedStartsAt: startsAt,
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
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "That time slot is already booked. Please choose another time.", code: 409 };
        }
        console.error("Error in rescheduleBooking:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function cancelBooking(id: string): ServiceResult<ServiceMessage> {
    try {
        const userId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        if (booking.status === "Cancelled" || booking.status === "Completed") {
            return { error: "This booking can no longer be cancelled.", code: 400 };
        }

        const { count } = await prisma.booking.updateMany({
            where: {
                id,
                status: { notIn: ["Cancelled", "Completed"] },
            },
            data: {
                status: "Cancelled",
            },
        });

        if (count === 0) {
            return { error: "This booking can no longer be cancelled.", code: 409 };
        }

        return { message: "Booking cancelled" };
    } catch (error) {
        console.error("Error in cancelBooking:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function acceptRescheduleBooking(id: string): ServiceResult<FullBooking> {
    try {
        const userId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: { id, userId },
            include: {
                service: {
                    include: {
                        business: {
                            include: { hours: true },
                        },
                    },
                },
            },
        });

        if (!booking) {
            return { error: "Booking not found", code: 404 };
        }

        if (!booking.suggestedStartsAt || !booking.suggestedEndsAt) {
            return { error: "No reschedule request is pending for this booking.", code: 400 };
        }

        if (booking.suggestedBy !== "Owner") {
            return { error: "You can only accept a reschedule requested by the owner.", code: 400 };
        }

        if (booking.status === "Cancelled" || booking.status === "Completed") {
            return { error: "This booking can no longer be rescheduled.", code: 400 };
        }

        const startsAt = booking.suggestedStartsAt;
        const endsAt = booking.suggestedEndsAt;
        const duration = booking.bookedDuration;
        const businessId = booking.service.businessId;

        const updatedBooking = await prisma.$transaction(async (tx) => {
            const businessOverlapValid = await checkBusinessBookingOverlap(tx, businessId, booking.id, startsAt.toISOString(), duration);
            if (!businessOverlapValid) {
                throw new BookingError("That time slot is now taken. Please contact the business.", 409);
            }

            const customerOverlapValid = await checkCustomerBookingOverlap(tx, userId, booking.id, startsAt.toISOString(), duration);
            if (!customerOverlapValid) {
                throw new BookingError("You have overlapping booking at this new time.", 409);
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
            return { error: "That time slot is now taken. Please contact the business.", code: 409 };
        }
        console.error("Error in acceptRescheduleBooking:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function declineRescheduleBooking(id: string): ServiceResult<ServiceMessage> {
    try {
        const userId = getUserId();

        const booking = await prisma.booking.findFirst({
            where: { id, userId },
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
