import { handler } from "@/lib/handler";
import { bookingIdSchema, createBookingSchema, paginationQuerySchema, querySearchSchema } from "@/lib/validators";
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

export default router;
