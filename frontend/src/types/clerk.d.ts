import { Role } from "./models";

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
