import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { createServiceSchema, updateServiceSchema } from "@/lib/validators";
import type { PaginatedData, ServiceMessage, ServiceResult } from "@/types/response";
import { Prisma, type Booking, type Service } from "@prisma/client";
import type z from "zod";

type CreateServicePayload = z.infer<typeof createServiceSchema>;
type UpdateServicePayload = z.infer<typeof updateServiceSchema>;

type FullService = Service & {
    bookings: Booking[];
};

const fullServiceInclude = {
    bookings: true,
} satisfies Prisma.ServiceInclude;

export async function getBusinessServices(businessId: string, page: number, limit: number): ServiceResult<PaginatedData<FullService>> {
    try {
        const ownerId = getUserId();

        const queryWhere = {
            business: {
                id: businessId,
                ownerId,
            },
        };

        const [total, services] = await Promise.all([
            prisma.service.count({ where: queryWhere }),
            prisma.service.findMany({
                where: queryWhere,
                take: limit,
                skip: (page - 1) * limit,
                include: fullServiceInclude,
            }),
        ]);

        if (!services.length && total === 0) {
            const businessExists = await prisma.business.findFirst({
                where: {
                    id: businessId,
                    ownerId,
                },
                select: {
                    id: true,
                },
            });

            if (!businessExists) {
                return { error: "Business not found", code: 404 };
            }
        }

        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        return {
            total,
            hasMore,
            data: services,
            totalPages: totalPages || 1,
        };
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function createService(data: CreateServicePayload): ServiceResult<FullService> {
    try {
        const ownerId = getUserId();

        const business = await prisma.business.findFirst({
            where: {
                id: data.businessId,
                ownerId,
            },
        });

        if (!business) {
            return { error: "Business not found or not owned by you", code: 404 };
        }

        if (business.status !== "Active") {
            return { error: "You must activate your business to add new services.", code: 400 };
        }

        const existing = await prisma.service.findFirst({
            where: {
                businessId: data.businessId,
                name: data.name,
                business: {
                    ownerId,
                },
            },
        });

        if (existing) {
            return { error: "Service with that name already exists", code: 409 };
        }

        const service = await prisma.service.create({
            data,
            include: fullServiceInclude,
        });

        return service;
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "Service with that name already exists", code: 409 };
        }
        return { error: "Internal server error", code: 500 };
    }
}

export async function updateService(id: string, data: UpdateServicePayload): ServiceResult<FullService> {
    try {
        const ownerId = getUserId();

        const service = await prisma.service.findFirst({
            where: {
                id,
                business: { ownerId },
            },
            include: {
                business: true,
            },
        });

        if (!service) {
            return { error: "Service not found or not in your business", code: 404 };
        }

        if (service.business.status === "Closed") {
            return { error: "Can't modify services of a closed business.", code: 400 };
        }

        const updated = await prisma.service.update({
            where: {
                id,
            },
            data,
            include: fullServiceInclude,
        });

        return updated;
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "Service with that name already exists", code: 409 };
        }
        return { error: "Internal server error", code: 500 };
    }
}

export async function toggleService(id: string): ServiceResult<ServiceMessage> {
    try {
        const ownerId = getUserId();

        const service = await prisma.service.findFirst({
            where: {
                id,
                business: {
                    ownerId,
                },
            },
            include: {
                business: true,
            },
        });

        if (!service) {
            return { error: "Service not found.", code: 404 };
        }

        if (service.business.status === "Closed") {
            return { error: "Can't modify services of a closed business.", code: 400 };
        }

        const isActive = service.isActive;

        await prisma.$transaction(async (trx) => {
            if (isActive) {
                const activeBooking = await trx.booking.findFirst({
                    where: {
                        serviceId: id,
                        status: "Confirmed",
                    },
                });

                if (activeBooking) {
                    return { error: "Can't deactivate a service with active confirmed bookings", code: 400 };
                }

                await trx.booking.updateMany({
                    where: {
                        serviceId: id,
                        status: "Pending",
                    },
                    data: {
                        status: "Cancelled",
                    },
                });
            }

            await trx.service.update({
                where: {
                    id: id,
                },
                data: {
                    isActive: !isActive,
                },
            });
        });

        const message = `Service ${isActive ? "Deactivated" : "Activated"}`;

        return { message };
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}
