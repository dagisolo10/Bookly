import { handler } from "@/lib/handler";
import { Router, type Request } from "express";
import { validate } from "@/middlewares/validation";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { createUserSchema, updateUserSchema } from "@/lib/validators";
import { becomeBusinessOwner, createUser, getMe, updateUser } from "@/services/user";

const router = Router();

router.get(
    "/me",
    requireAuth,
    requireUserProfile,
    handler(() => getMe()),
);

router.post(
    "/become-owner",
    requireAuth,
    requireUserProfile,
    handler(() => becomeBusinessOwner()),
);

router.post(
    "/",
    requireAuth,
    validate(createUserSchema, "body"),
    handler((req: Request) => createUser(req.body)),
);

router.patch(
    "/",
    requireAuth,
    requireUserProfile,
    validate(updateUserSchema, "body"),
    handler((req: Request) => updateUser(req.body)),
);

export default router;
