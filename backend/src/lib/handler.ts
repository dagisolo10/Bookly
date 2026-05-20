import { hasServiceError } from "@/types/response";
import { type Request, type Response } from "express";

type NoReqHandler<T> = () => Promise<T>;
type ReqHandler<T> = (req: Request) => Promise<T>;

export function handler<T>(fn: NoReqHandler<T>): any;
export function handler<T>(fn: ReqHandler<T>): any;

export function handler(fn: any) {
    return async (req: Request, res: Response) => {
        try {
            const result = await fn(req);

            if (hasServiceError(result)) {
                return res.status(result.code).json(result);
            }

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };
}