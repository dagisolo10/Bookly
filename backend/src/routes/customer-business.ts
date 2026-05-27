import { handler } from "@/lib/handler";
import { businessIdSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { validate } from "@/middlewares/validation";
import { getBusinessById, getBusinesses } from "@/services/customer-business";
import { Router, type Request } from "express";

const router = Router();

router.get(
    "/",
    requireAuth,
    requireUserProfile,
    handler(() => getBusinesses()),
);

router.get(
    "/:id",
    requireAuth,
    requireUserProfile,
    validate(businessIdSchema, "params"),
    handler((req: Request) => getBusinessById(req.params["businessId"] as string)),
);

export default router;
