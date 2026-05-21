import { type Request, type Response } from "express";
import { hasServiceError, type ServiceResult } from "@/types/response";

export function handler<T>(fn: () => ServiceResult<T>): (req: Request, res: Response) => void;
export function handler<T>(fn: (req: Request) => ServiceResult<T>): (req: Request, res: Response) => void;

export function handler<T>(fn: (...args: Request[]) => ServiceResult<T>) {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await fn(req);

            if (hasServiceError(result)) {
                res.status(result.code).json(result);
                return;
            }

            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
