import { handler } from "@/lib/handler";
import { businessIdSchema, paginationQuerySchema, querySearchSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { validate } from "@/middlewares/validation";
import { getBusinessById, getBusinesses } from "@/services/customer-business";
import { Router, type Request } from "express";

const router = Router();

router.get(
    "/",
    requireAuth,
    requireUserProfile,
    validate(querySearchSchema, "query"),
    validate(paginationQuerySchema, "query"),
    handler((req: Request) => {
        const query = req.query["query"] as string;
        const page = parseInt(req.query["page"] as string, 10) || 1;
        const limit = parseInt(req.query["limit"] as string, 10) || 10;
        return getBusinesses(page, limit, query);
    }),
);

router.get(
    "/:id",
    requireAuth,
    requireUserProfile,
    validate(businessIdSchema, "params"),
    handler((req: Request) => getBusinessById(req.params["id"] as string)),
);

export default router;
