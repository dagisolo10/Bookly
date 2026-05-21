import { handler } from "@/lib/handler";
import { Router, type Request } from "express";
import { validate } from "@/middlewares/validation";
import { requireBusinessRole } from "@/middlewares/role";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { getBookingById, getBusinessBookings, manageBooking } from "@/services/owner-booking";
import { bookingBusinessIdSchema, bookingIdSchema, manageBookingSchema } from "@/lib/validators";

const router = Router();

router.get(
    "/:id",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(bookingIdSchema, "params"),
    handler((req: Request) => getBookingById(req.params["id"] as string)),
);

router.get(
    "/business/:businessId",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(bookingBusinessIdSchema, "params"),
    handler((req: Request) => getBusinessBookings(req.params["businessId"] as string)),
);

router.patch(
    "/:id/manage",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(bookingIdSchema, "params"),
    validate(manageBookingSchema, "body"),
    handler((req: Request) => manageBooking(req.params["id"] as string, req.body.newStatus)),
);

export default router;
