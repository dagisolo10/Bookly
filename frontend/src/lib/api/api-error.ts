import type { ApiError, BackendValidationError } from "./api-response";

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

function isAxiosError(error: unknown): error is AxiosError {
    return typeof error === "object" && error !== null && "isAxiosError" in error && (error as AxiosError).isAxiosError === true;
}

function isBackendErrorBody(value: unknown): value is BackendValidationError {
    return typeof value === "object" && value !== null && "error" in value && typeof (value as { error: string }).error === "string";
}

export function messageFromAxiosError(err: unknown): string {
    if (err instanceof ApiRequestError) return err.message;
    if (typeof err === "string") return err;

    if (!isAxiosError(err)) {
        return err instanceof Error ? err.message : "Unknown error";
    }

    const ax = err as AxiosError<BackendValidationError | string>;
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
        "__isApiError" in result &&
        (result as ApiError).__isApiError === true
    );
}
