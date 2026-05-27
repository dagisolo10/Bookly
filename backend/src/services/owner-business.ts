import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import { removeImages, uploadImages } from "@/lib/supabase/upload-image";
import type { CreateBusinessPayload, UpdateBusinessPayload } from "@/types/payload";
import { type FullBusiness, fullBusinessInclude } from "@/types/populated";
import type { PaginatedData, ServiceMessage, ServiceResult } from "@/types/response";
import { Prisma } from "@prisma/client";

async function findOwnedBusiness(id: string, ownerId: string) {
    return prisma.business.findFirst({
        where: {
            id,
            ownerId,
        },
        include: fullBusinessInclude,
    });
}

export async function getMyBusinesses(page: number, limit: number, query: string): ServiceResult<PaginatedData<FullBusiness>> {
    try {
        const ownerId = getUserId();

        const queryWhere = {
            ownerId,
            ...(query && {
                OR: [{ name: { contains: query, mode: Prisma.QueryMode.insensitive } }, { location: { contains: query, mode: Prisma.QueryMode.insensitive } }],
            }),
        };

        const [total, businesses] = await Promise.all([
            prisma.business.count({ where: queryWhere }),
            prisma.business.findMany({
                where: queryWhere,
                take: limit,
                skip: (page - 1) * limit,
                include: fullBusinessInclude,
                orderBy: { createdAt: "desc" },
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

export async function createBusiness(data: CreateBusinessPayload, files: Express.Multer.File[]): ServiceResult<FullBusiness> {
    let newUploadedUrls: string[] = [];

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

        const uploadResult = await uploadImages(files, "business", "bannerImages");

        if (!uploadResult.success) {
            return { error: uploadResult.error, code: 500 };
        }

        newUploadedUrls = uploadResult.images;

        const business = await prisma.business.create({
            data: {
                ownerId,
                ...rest,
                bannerImages: uploadResult.images,
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
        if (newUploadedUrls.length > 0) {
            try {
                await removeImages(newUploadedUrls, "bannerImages");
            } catch (cleanupErr) {
                console.error("Upload rollback failed:", cleanupErr);
            }
        }
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function updateBusiness(id: string, data: UpdateBusinessPayload, files: Express.Multer.File[]): ServiceResult<FullBusiness> {
    let newUploadedUrls: string[] = [];

    try {
        const ownerId = getUserId();

        const business = await findOwnedBusiness(id, ownerId);

        if (!business) {
            return { error: "Business not found or not owned by you", code: 404 };
        }

        if (business.status === "Closed") {
            return { error: "Closed businesses can not be edited.", code: 400 };
        }

        const { hours, removedBannerImages, ...rest } = data;

        const keptImages = business.bannerImages.filter((img) => !(removedBannerImages || []).includes(img));

        const uploadResult = await uploadImages(files, "business", "bannerImages");

        if (!uploadResult.success) {
            return { error: uploadResult.error, code: 500 };
        }

        newUploadedUrls = uploadResult.images;

        const finalImages = [...keptImages, ...uploadResult.images];

        const updated = await prisma.business.update({
            where: {
                id,
            },
            data: {
                ...rest,
                bannerImages: finalImages,
                ...(hours !== undefined && {
                    hours: {
                        deleteMany: {},
                        createMany: { data: hours },
                    },
                }),
            },
            include: fullBusinessInclude,
        });

        try {
            const removable = business.bannerImages.filter((img) => (data.removedBannerImages ?? []).includes(img));
            await removeImages(removable, "bannerImages");
        } catch (err) {
            console.error("Cleanup failed:", err);
        }

        return updated;
    } catch (error) {
        if (newUploadedUrls.length > 0) {
            try {
                await removeImages(newUploadedUrls, "bannerImages");
            } catch (cleanupErr) {
                console.error("Upload rollback failed:", cleanupErr);
            }
        }
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
            return { error: "Can't close business with active bookings. Please complete or cancel them first.", code: 400 };
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

        try {
            await removeImages(business.bannerImages, "bannerImages");
        } catch (err) {
            console.error("Cleanup failed:", err);
        }

        return { message: "Business Closed" };
    } catch (error) {
        console.error(error);
        return { error: "Internal server error", code: 500 };
    }
}
