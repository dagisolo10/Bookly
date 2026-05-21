import type z from "zod";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/request-context";
import type { userSchema } from "@/lib/validators";
import type { ServiceResult } from "@/types/response";
import type { Booking, Business, Prisma, User } from "@prisma/client";

type CreateUserPayload = z.infer<typeof userSchema>;
type UpdateUserPayload = z.infer<typeof userSchema>;

type FullUser = User & {
    bookings: Booking[];
    businesses: Business[];
};

const fullUserInclude = {
    bookings: true,
    businesses: true,
} satisfies Prisma.UserInclude;

export async function getMe(): ServiceResult<FullUser> {
    try {
        const id = getUserId();

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: fullUserInclude,
        });

        if (!user)
            return {
                error: "User not found",
                code: 404,
            };

        return user;
    } catch (error) {
        console.error(error);

        return {
            error: "Internal server error",
            code: 500,
        };
    }
}

export async function createUser(data: CreateUserPayload): ServiceResult<FullUser> {
    try {
        const id = getUserId();

        const existing = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

        if (existing) {
            return {
                error: "User already exists",
                code: 409,
            };
        }

        const user = await prisma.user.create({
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
