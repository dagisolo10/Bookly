import env from "@/utils/env";
import prisma from "@/lib/prisma.js";
import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { getUserId, runWithRequestContext } from "@/lib/request-context";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    let userId: string | null = null;
    const isDevelopment = env.NODE_ENV === "development";

    const { isAuthenticated, userId: clerkUserId } = getAuth(req);

    if (!isAuthenticated && !isDevelopment) {
        return res.status(401).json({ error: "User is not authenticated" });
    }

    userId = isDevelopment ? (req.headers["userid"] as string) : clerkUserId;

    if (!userId) {
        return res.status(401).json({
            error: isDevelopment ? "userId header is required" : "Unauthorized. Login First",
        });
    }

    runWithRequestContext(userId, [], next);
}

export async function requireUserProfile(_: Request, res: Response, next: NextFunction) {
    const userId = getUserId();

    const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { roles: true },
    });

    if (!dbUser) {
        return res.status(403).json({
            error: "Complete registration first",
        });
    }

    runWithRequestContext(userId, dbUser.roles, next);
}
