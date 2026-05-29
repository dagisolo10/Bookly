import prisma from "@/lib/prisma";
import { fullServiceInclude, type FullService } from "@/types/populated";
import type { PaginatedData, ServiceResult } from "@/types/response";
import { Prisma } from "@prisma/client";

export async function getServices(page: number, limit: number, query: string): ServiceResult<PaginatedData<FullService>> {
    try {
        const queryWhere = {
            business: {
                status: "Active",
            },
            name: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
            },
        } satisfies Prisma.ServiceWhereInput;

        const [total, services] = await Promise.all([
            prisma.service.count({ where: queryWhere }),
            prisma.service.findMany({
                where: queryWhere,
                take: limit,
                skip: (page - 1) * limit,
                include: fullServiceInclude,
            }),
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        return {
            total,
            hasMore,
            totalPages: totalPages || 1,
            data: services,
        };
    } catch (error) {
        console.error("Error in getServices:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getBusinessServices(businessId: string, page: number, limit: number, query: string): ServiceResult<PaginatedData<FullService>> {
    try {
        const queryWhere = {
            businessId,
            name: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
            },
        } satisfies Prisma.ServiceWhereInput;

        const business = await prisma.business.findFirst({
            where: {
                id: businessId,
                status: "Active",
            },
            select: {
                id: true,
            },
        });

        if (!business) {
            return { error: "Service doesn't belong to this business", code: 404 };
        }

        const [total, services] = await Promise.all([
            prisma.service.count({ where: queryWhere }),
            prisma.service.findMany({
                where: queryWhere,
                take: limit,
                skip: (page - 1) * limit,
                include: fullServiceInclude,
            }),
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        return {
            total,
            hasMore,
            totalPages: totalPages || 1,
            data: services,
        };
    } catch (error) {
        console.error("Error in getBusinessServices:", error);
        return { error: "Internal server error", code: 500 };
    }
}
