import type { Role } from "@prisma/client";
import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<{ userId: string; roles: Role[] }>();

export function getUserId(): string {
    const store = asyncLocalStorage.getStore();
    if (!store) throw new Error("No request context available");
    return store.userId;
}

export function getUserRole(): Role[] {
    const store = asyncLocalStorage.getStore();
    if (!store) throw new Error("No request context available");
    return store.roles;
}

export function runWithRequestContext(userId: string, roles: Role[], next: () => void) {
    asyncLocalStorage.run({ userId, roles: roles }, next);
}
