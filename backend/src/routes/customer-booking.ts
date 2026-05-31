import { handler } from "@/lib/handler";
import { Router, type Request } from "express";
import { validate } from "@/middlewares/validation";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { cancelBooking, createBooking, getBookingById, getMyBookings, rescheduleBooking } from "@/services/customer-booking";
import { bookingIdSchema, createBookingSchema, paginationQuerySchema, querySearchSchema, rescheduleBookingSchema } from "@/lib/validators";

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
    validate(querySearchSchema, "query"),
    validate(paginationQuerySchema, "query"),
    handler((req: Request) => {
        const page = parseInt(req.query["page"] as string, 10) || 1;
        const limit = parseInt(req.query["limit"] as string, 10) || 10;
        const query = req.query["query"] as string;
        return getMyBookings(page, limit, query);
    }),
);

router.get(
    "/:id",
    requireAuth,
    requireUserProfile,
    validate(bookingIdSchema, "params"),
    handler((req: Request) => getBookingById(req.params["id"] as string)),
);

router.patch(
    "/:id/reschedule",
    requireAuth,
    requireUserProfile,
    validate(bookingIdSchema, "params"),
    validate(rescheduleBookingSchema, "body"),
    handler((req: Request) => rescheduleBooking(req.params["id"] as string, req.body)),
);

router.patch(
    "/:id/cancel",
    requireAuth,
    requireUserProfile,
    validate(bookingIdSchema, "params"),
    handler((req: Request) => cancelBooking(req.params["id"] as string)),
);

export default router;
