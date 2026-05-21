import type z from "zod";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { Booking, Prisma, Service } from "@prisma/client";
import type { ServiceMessage, ServiceResult } from "@/types/response";
import type { createServiceSchema, updateServiceSchema } from "@/lib/validators";

type CreateServicePayload = z.infer<typeof createServiceSchema>;
type UpdateServicePayload = z.infer<typeof updateServiceSchema>;

type FullService = Service & {
    bookings: Booking[];
};

const fullServiceInclude = {
    bookings: true,
} satisfies Prisma.ServiceInclude;

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

        const activeBooking = await prisma.booking.findFirst({
            where: {
                serviceId: id,
                status: "Confirmed",
            },
        });

        if (activeBooking && isActive) {
            return { error: "Can't deactivate a service with active confirmed bookings", code: 400 };
        }

        await prisma.$transaction(async (trx) => {
            if (isActive) {
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
