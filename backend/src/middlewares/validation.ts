import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

type Target = "body" | "params" | "query";

export function validate<T extends z.ZodTypeAny>(schema: T, target: Target) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);

        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }

        switch (target) {
            case "body":
                req.body = result.data;
                break;
            case "params":
                req.params = result.data as unknown as ParamsDictionary;
                break;
            case "query":
                req.query = result.data as unknown as Request["query"];
                break;
        }
        return next();
    };
}
