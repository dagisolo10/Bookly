import { handler } from "@/lib/handler";
import { businessIdSchema, createBusinessSchema, paginationQuerySchema, querySearchSchema, updateBusinessSchema } from "@/lib/validators";
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
    validate(querySearchSchema, "query"),
    validate(paginationQuerySchema, "query"),
    handler((req: Request) => {
        const query = req.query["query"] as string;
        const page = parseInt(req.query["page"] as string, 10) || 1;
        const limit = parseInt(req.query["limit"] as string, 10) || 10;
        return getMyBusinesses(page, limit, query);
    }),
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
