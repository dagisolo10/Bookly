export function hasServiceError(r: unknown): r is ServiceError {
    const isObject = typeof r === "object";
    const isNotNull = r !== null;

    return isObject && isNotNull && "error" in r && "code" in r && typeof (r as any).error === "string" && typeof (r as any).code === "number";
}

export type ServiceMessage = { message: string };
export type ServiceError = { error: string; code: number; __isApiError?: true };

export type ServiceResult<T> = Promise<T | ServiceError>;
