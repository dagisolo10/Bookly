import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { UpdateUserPayload } from "@/types/payload";
import { type FullUser, fullUserInclude } from "@/types/populated";
import type { ServiceResult } from "@/types/response";
import env from "@/utils/env";
import { clerkClient, createClerkClient } from "@clerk/express";

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

export async function getUser(): ServiceResult<FullUser> {
    try {
        const id = getUserId();

        let user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: fullUserInclude,
        });

        if (!user) {
            const clerkUser = await clerkClient.users.getUser(id);

            const fallbackName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
            const name = clerkUser.fullName?.trim() || fallbackName || "User";

            user = await prisma.user.upsert({
                where: { id },
                update: { name },
                create: { id, name },
                include: fullUserInclude,
            });
        }

        try {
            await clerk.users.updateUserMetadata(id, {
                publicMetadata: {
                    roles: user.roles,
                },
            });
        } catch (error) {
            console.error("Failed to sync Clerk user metadata", error);
        }

        return user;
    } catch (error) {
        console.error(error);

        return {
            error: "Internal server error",
            code: 500,
        };
    }
}

export async function updateUser(data: UpdateUserPayload): ServiceResult<FullUser> {
    try {
        const id = getUserId();

        const existing = await prisma.user.findUnique({
            where: {
                id,
            },
            include: fullUserInclude,
        });

        if (!existing)
            return {
                error: "User not found",
                code: 404,
            };

        const user = await prisma.user.update({
            where: {
                id,
            },
            data,
            include: fullUserInclude,
        });

        return user;
    } catch (error) {
        console.error(error);
        return {
            error: "Internal server error",
            code: 500,
        };
    }
}

export async function becomeBusinessOwner(): ServiceResult<FullUser> {
    try {
        const id = getUserId();

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: fullUserInclude,
        });

        if (!user) {
            return {
                error: "User not found",
                code: 404,
            };
        }

        if (!user.roles.includes("Business")) {
            return prisma.user.update({
                where: {
                    id,
                },
                data: {
                    roles: {
                        push: "Business",
                    },
                },
                include: fullUserInclude,
            });
        }

        return user;
    } catch (error) {
        console.error(error);
        return {
            error: "Internal server error",
            code: 500,
        };
    }
}
