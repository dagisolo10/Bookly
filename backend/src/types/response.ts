export function hasServiceError(r: unknown): r is ServiceError {
    const isObject = typeof r === "object";
    const isNotNull = r !== null;

    return isObject && isNotNull && "error" in r && "status" in r && typeof (r as any).error === "string" && typeof (r as any).status === "number";
}

export type ServiceMessage = { message: string };
export type ServiceError = { error: string; code: number };

export type ServiceResult<T> = Promise<T | ServiceError>;
