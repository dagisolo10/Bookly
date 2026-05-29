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
        const page = (req.query["page"] as unknown as number) || 1;
        const limit = (req.query["limit"] as unknown as number) || 10;
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
