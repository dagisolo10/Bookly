import prisma from "@/lib/prisma";
import { fullBusinessInclude, type FullBusiness } from "@/types/populated";
import type { ServiceResult } from "@/types/response";

export async function getBusinesses(): ServiceResult<FullBusiness[]> {
    try {
        const businesses = await prisma.business.findMany({
            where: {
                status: "Active",
            },
            include: fullBusinessInclude,
        });

        return businesses;
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
