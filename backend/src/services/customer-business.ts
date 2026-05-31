import prisma from "@/lib/prisma";
import { fullBusinessInclude, type FullBusiness } from "@/types/populated";
import type { PaginatedData, ServiceResult } from "@/types/response";
import { Prisma } from "@prisma/client";

export async function getBusinesses(page: number, limit: number, query: string): ServiceResult<PaginatedData<FullBusiness>> {
    try {
        const queryWhere = {
            status: "Active",
            ...(query && {
                OR: [{ name: { contains: query, mode: Prisma.QueryMode.insensitive } }, { location: { contains: query, mode: Prisma.QueryMode.insensitive } }],
            }),
        } satisfies Prisma.BusinessWhereInput;

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
        console.error("Error in getBusinesses:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getBusinessById(id: string): ServiceResult<FullBusiness> {
    try {
        const business = await prisma.business.findUnique({
            where: {
                id,
            },
            include: fullBusinessInclude,
        });

        if (!business) {
            return { error: "Business not found", code: 404 };
        }

        if (business.status !== "Active") {
            return { error: "This business is currently not active", code: 400 };
        }

        return business;
    } catch (error) {
        console.error("Error in getBusinessById:", error);
        return { error: "Internal server error", code: 500 };
    }
}
