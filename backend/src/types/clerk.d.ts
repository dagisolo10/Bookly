import { Role } from "@prisma/client";

export {};

declare global {
    interface UserPublicMetadata {
        roles?: Role[];
    }

    interface CustomJwtSessionClaims {
        metadata: {
            roles?: Role[];
        };
    }
}
