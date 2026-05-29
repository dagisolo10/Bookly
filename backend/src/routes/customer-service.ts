import { handler } from "@/lib/handler";
import { paginationQuerySchema, querySearchSchema, serviceBusinessIdSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { validate } from "@/middlewares/validation";
import { getBusinessServices, getServices } from "@/services/customer-service";
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
        return getServices(page, limit, query);
    }),
);

router.get(
    "/business/:businessId",
    requireAuth,
    requireUserProfile,
    validate(querySearchSchema, "query"),
    validate(paginationQuerySchema, "query"),
    validate(serviceBusinessIdSchema, "params"),
    handler((req: Request) => {
        const query = req.query["query"] as string;
        const page = parseInt(req.query["page"] as string, 10) || 1;
        const limit = parseInt(req.query["limit"] as string, 10) || 10;
        return getBusinessServices(req.params["businessId"] as string, page, limit, query);
    }),
);

export default router;
