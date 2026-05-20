import { getUserRole } from "@/lib/request-context";
import type { NextFunction, Request, Response } from "express";

export function requireBusinessRole(_: Request, res: Response, next: NextFunction) {
    const roles = getUserRole();

    if (!roles.includes("Business")) {
        return res.status(403).json({
            error: "Requires Business Role",
        });
    }

    next();
}

export function requireAdminsRole(_: Request, res: Response, next: NextFunction) {
    const roles = getUserRole();

    if (!roles.includes("Admin")) {
        return res.status(403).json({
            error: "Requires Admin Role",
        });
    }

    next();
}
