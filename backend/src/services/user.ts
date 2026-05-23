import type z from "zod";
import env from "@/utils/env";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { userSchema } from "@/lib/validators";
import type { ServiceResult } from "@/types/response";
import { clerkClient, createClerkClient } from "@clerk/express";
import type { Booking, Business, Prisma, User } from "@prisma/client";

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

type UpdateUserPayload = z.infer<typeof userSchema>;

type FullUser = User & {
    bookings: Booking[];
    businesses: Business[];
};

const fullUserInclude = {
    bookings: true,
    businesses: true,
} satisfies Prisma.UserInclude;

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

            const name = clerkUser.fullName ?? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ?? "User";

            user = await prisma.user.create({
                data: {
                    id,
                    name,
                },
                include: fullUserInclude,
            });
        }

        await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
                roles: user.roles,
            },
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
