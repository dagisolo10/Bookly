import { handler } from "@/lib/handler";
import { userSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { validate } from "@/middlewares/validation";
import { becomeBusinessOwner, createUser, getMe, updateUser } from "@/services/user";
import { Router, type Request } from "express";

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
    validate(userSchema, "body"),
    handler((req: Request) => createUser(req.body)),
);

router.patch(
    "/",
    requireAuth,
    requireUserProfile,
    validate(userSchema, "body"),
    handler((req: Request) => updateUser(req.body)),
);

export default router;
