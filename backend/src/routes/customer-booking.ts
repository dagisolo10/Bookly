import { handler } from "@/lib/handler";
import { bookingIdSchema, createBookingSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { validate } from "@/middlewares/validation";
import { createBooking, getBookingById, getMyBookings } from "@/services/customer-booking";
import { Router, type Request } from "express";

const router = Router();

router.post(
    "/",
    requireAuth,
    requireUserProfile,
    validate(createBookingSchema, "body"),
    handler((req: Request) => createBooking(req.body)),
);

router.get(
    "/",
    requireAuth,
    requireUserProfile,
    handler(() => getMyBookings()),
);

router.get(
    "/:id",
    requireAuth,
    requireUserProfile,
    validate(bookingIdSchema, "params"),
    handler((req: Request) => getBookingById(req.params["id"] as string)),
);

export default router;
