import type { ApiError, ZodError } from "./api-response";

import type { AxiosError } from "axios";

export class ApiRequestError extends Error {
    readonly status: number | undefined;
    readonly body: unknown;

    constructor(message: string, status?: number, body?: unknown) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
        this.body = body;
    }
}

function isBackendErrorBody(value: unknown): value is ZodError {
    return typeof value === "object" && value !== null && "error" in value && typeof (value as ZodError).error === "string";
}

export function messageFromAxiosError(err: unknown): string {
    if (err instanceof ApiRequestError) return err.message;
    if (typeof err === "string") return err;

    const ax = err as AxiosError<ZodError | string>;
    const status = ax.response?.status;
    const data = ax.response?.data;

    if (data === undefined || data === null) {
        return ax.message || (status ? `Request failed (${status})` : "Network error");
    }

    if (typeof data === "string") return data;

    if (isBackendErrorBody(data)) {
        const base = data.error;
        return data.details ? `${base}: ${data.details}` : base;
    }

    return status ? `Request failed (${status})` : "Request failed";
}

export function hasApiError(result: unknown): result is ApiError {
    return (
        typeof result === "object" &&
        result !== null &&
        "error" in result &&
        "code" in result &&
        typeof (result as Record<"error", unknown>).error === "string" &&
        typeof (result as Record<"code", unknown>).code === "number"
    );
}
