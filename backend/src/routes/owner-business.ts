import { handler } from "@/lib/handler";
import { businessIdSchema, createBusinessSchema, updateBusinessSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { requireBusinessRole } from "@/middlewares/role";
import { validate } from "@/middlewares/validation";
import { closeBusiness, createBusiness, getMyBusinessById, getMyBusinesses, toggleBusiness, updateBusiness } from "@/services/owner-business";
import { Router, type Request } from "express";

const router = Router();

router.get(
    "/my",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    handler(() => getMyBusinesses()),
);

router.get(
    "/my/:id",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(businessIdSchema, "params"),
    handler((req: Request) => getMyBusinessById(req.params["id"] as string)),
);

router.post(
    "/",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(createBusinessSchema, "body"),
    handler((req: Request) => createBusiness(req.body)),
);

router.patch(
    "/:id",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(businessIdSchema, "params"),
    validate(updateBusinessSchema, "body"),
    handler((req: Request) => updateBusiness(req.params["id"] as string, req.body)),
);

router.patch(
    "/:id/toggle",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(businessIdSchema, "params"),
    handler((req: Request) => toggleBusiness(req.params["id"] as string)),
);

router.patch(
    "/:id/close",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(businessIdSchema, "params"),
    handler((req: Request) => closeBusiness(req.params["id"] as string)),
);

export default router;
