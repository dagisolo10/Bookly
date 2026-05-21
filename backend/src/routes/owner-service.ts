import { handler } from "@/lib/handler";
import { Router, type Request } from "express";
import { validate } from "@/middlewares/validation";
import { requireBusinessRole } from "@/middlewares/role";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { createService, toggleService, updateService } from "@/services/owner-service";
import { createServiceSchema, serviceIdSchema, updateServiceSchema } from "@/lib/validators";

const router = Router();

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
