import { handler } from "@/lib/handler";
import { createServiceSchema, paginationQuerySchema, querySearchSchema, serviceBusinessIdSchema, serviceIdSchema, updateServiceSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { requireBusinessRole } from "@/middlewares/role";
import { validate } from "@/middlewares/validation";
import { createService, getBusinessServices, toggleService, updateService } from "@/services/owner-service";
import { Router, type Request } from "express";

const router = Router();

router.get(
    "/business/:businessId",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(querySearchSchema, "query"),
    validate(paginationQuerySchema, "query"),
    validate(serviceBusinessIdSchema, "params"),
    handler((req: Request) => {
        const businessId = req.params["businessId"] as string;
        const page = parseInt(req.query["page"] as string, 10) || 1;
        const limit = parseInt(req.query["limit"] as string, 10) || 10;
        const query = req.query["query"] as string;
        return getBusinessServices(businessId, page, limit, query);
    }),
);

router.post(
    "/",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(createServiceSchema, "body"),
    handler((req: Request) => createService(req.body)),
);

router.patch(
    "/:id",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(serviceIdSchema, "params"),
    validate(updateServiceSchema, "body"),
    handler((req: Request) => updateService(req.params["id"] as string, req.body)),
);

router.patch(
    "/:id/toggle",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(serviceIdSchema, "params"),
    handler((req: Request) => toggleService(req.params["id"] as string)),
);

export default router;
