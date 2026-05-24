import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

type Target = "body" | "params" | "query";

export function validate<T extends z.ZodTypeAny>(schema: T, target: Target) {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req[target]);

        if (!parsed.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: parsed.error.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }

        const current = req[target] as Record<string, unknown>;
        Object.keys(current).forEach((key) => delete current[key]);
        Object.assign(current, parsed.data as Record<string, unknown>);
        return next();
    };
}
