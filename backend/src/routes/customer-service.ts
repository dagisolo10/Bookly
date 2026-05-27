import { handler } from "@/lib/handler";
import { serviceBusinessIdSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { validate } from "@/middlewares/validation";
import { getBusinessServices, getServices } from "@/services/customer-service";
import { Router, type Request } from "express";

const router = Router();

router.get(
    "/",
    requireAuth,
    requireUserProfile,
    handler(() => getServices()),
);

router.get(
    "/businessId",
    requireAuth,
    requireUserProfile,
    validate(serviceBusinessIdSchema, "params"),
    handler((req: Request) => getBusinessServices(req.params["businessId"] as string)),
);

export default router;
