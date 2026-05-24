import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { createBusinessSchema, updateBusinessSchema } from "@/lib/validators";
import type { PaginatedData, ServiceMessage, ServiceResult } from "@/types/response";
import { Prisma, type Business, type BusinessHour as PrismaBusinessHour } from "@prisma/client";
import type z from "zod";

type FullBusiness = Business & {
    hours: PrismaBusinessHour[];
};

export type CreateBusinessPayload = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessPayload = z.infer<typeof updateBusinessSchema>;

const fullBusinessInclude = {
    hours: true,
} satisfies Prisma.BusinessInclude;

async function findOwnedBusiness(id: string, ownerId: string) {
    return prisma.business.findFirst({
        where: {
            id,
            ownerId,
        },
        include: fullBusinessInclude,
    });
}

export async function getMyBusinesses(page: number, limit: number): ServiceResult<PaginatedData<FullBusiness>> {
    try {
        const ownerId = getUserId();

        const [total, businesses] = await Promise.all([
            prisma.business.count({ where: { ownerId } }),
            prisma.business.findMany({
                where: {
                    ownerId,
                },
                take: limit,
                skip: (page - 1) * limit,
                include: fullBusinessInclude,
            }),
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        return {
            total,
            hasMore,
            totalPages,
            data: businesses,
        };
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getMyBusinessById(id: string): ServiceResult<FullBusiness> {
    try {
        const ownerId = getUserId();

        const business = await findOwnedBusiness(id, ownerId);

        if (!business) {
            return { error: "Business not found", code: 404 };
        }

        return business;
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function createBusiness(data: CreateBusinessPayload): ServiceResult<FullBusiness> {
    try {
        const ownerId = getUserId();

        const existing = await prisma.business.findFirst({
            where: {
                ownerId,
                name: data.name,
            },
            select: {
                id: true,
            },
        });

        if (existing) {
            return { error: "Business with this name already exists in your account.", code: 409 };
        }

        const { hours, ...rest } = data;

        const business = await prisma.business.create({
            data: {
                ownerId,
                ...rest,
                hours: {
                    createMany: {
                        data: hours,
                    },
                },
            },
            include: fullBusinessInclude,
        });

        return business;
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function updateBusiness(id: string, data: UpdateBusinessPayload): ServiceResult<FullBusiness> {
    try {
        const ownerId = getUserId();

        const business = await findOwnedBusiness(id, ownerId);

        if (!business) {
            return { error: "Business not found or not owned by you", code: 404 };
        }

        if (business.status === "Closed") {
            return { error: "Closed businesses can not be edited.", code: 400 };
        }

        const { hours, ...rest } = data;

        const updated = await prisma.business.update({
            where: {
                id,
            },
            data: {
                ...rest,
                ...(hours !== undefined && {
                    hours: {
                        deleteMany: {},
                        createMany: {
                            data: hours,
                        },
                    },
                }),
            },
            include: fullBusinessInclude,
        });

        return updated;
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "Business with this name already exists in your account.", code: 409 };
        }
        return { error: "Internal server error", code: 500 };
    }
}

export async function toggleBusiness(id: string): ServiceResult<ServiceMessage> {
    try {
        const ownerId = getUserId();

        const business = await findOwnedBusiness(id, ownerId);

        if (!business) {
            return { error: "Business not found or not owned by you", code: 404 };
        }

        if (business.status === "Closed") {
            return { error: "Closed businesses cannot be toggled.", code: 400 };
        }

        const newStatus = business.status === "Paused" ? "Active" : "Paused";

        if (newStatus === "Paused") {
            const activeBooking = await prisma.booking.findFirst({
                where: {
                    service: {
                        businessId: business.id,
                    },
                    status: "Confirmed",
                },
            });

            if (activeBooking) {
                return { error: "Cannot pause business with active bookings", code: 400 };
            }

            await prisma.$transaction(async (tx) => {
                await tx.booking.updateMany({
                    where: {
                        service: {
                            businessId: business.id,
                        },
                        status: "Pending",
                    },
                    data: {
                        status: "Cancelled",
                    },
                });

                await tx.business.update({
                    where: {
                        id: business.id,
                    },
                    data: {
                        status: newStatus,
                    },
                });
            });
        } else {
            await prisma.business.update({
                where: {
                    id: business.id,
                },
                data: {
                    status: newStatus,
                },
            });
        }

        const message = `Business ${newStatus === "Active" ? "Activated" : "Paused"}`;

        return { message };
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function closeBusiness(id: string): ServiceResult<ServiceMessage> {
    try {
        const ownerId = getUserId();

        const business = await findOwnedBusiness(id, ownerId);

        if (!business) {
            return { error: "Business not found or not owned by you", code: 404 };
        }
        const activeBookings = await prisma.booking.findFirst({
            where: { service: { businessId: business.id }, status: "Confirmed" },
        });

        if (activeBookings) {
            return { error: "Can not close business with active bookings. Please complete or cancel them first.", code: 400 };
        }

        await prisma.$transaction(async (tx) => {
            await tx.booking.updateMany({
                where: {
                    service: {
                        businessId: business.id,
                    },
                    status: "Pending",
                },
                data: {
                    status: "Cancelled",
                },
            });

            await tx.service.updateMany({
                where: {
                    businessId: business.id,
                },
                data: {
                    isActive: false,
                },
            });

            await tx.business.update({
                where: {
                    id: business.id,
                },
                data: {
                    status: "Closed",
                    bannerImages: [],
                },
            });
        });

        return { message: "Business Closed" };
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}
