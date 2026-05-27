import prisma from "@/lib/prisma";

export async function getServices() {
    try {
        const services = await prisma.service.findMany({
            where: {
                business: {
                    status: "Active",
                },
            },
        });

        return services;
    } catch (error) {
        console.error("Error in getServices:", error);
        return { error: "Internal server error", code: 500 };
    }
}

export async function getBusinessServices(businessId: string) {
    try {
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

        const services = await prisma.service.findMany({
            where: {
                businessId,
            },
        });

        return services;
    } catch (error) {
        console.error("Error in getBusinessServices:", error);
        return { error: "Internal server error", code: 500 };
    }
}
