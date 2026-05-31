import { handler } from "@/lib/handler";
import { bookingBusinessIdSchema, bookingIdSchema, manageBookingSchema, ownerRescheduleBookingSchema, paginationQuerySchema, querySearchSchema, statusSearchSchema } from "@/lib/validators";
import { requireAuth, requireUserProfile } from "@/middlewares/auth";
import { requireBusinessRole } from "@/middlewares/role";
import { validate } from "@/middlewares/validation";
import { getBookingById, getBookingStatusCounts, getBusinessBookings, manageBooking, rescheduleBooking, type BookingFilterStatus } from "@/services/owner-booking";
import { Router, type Request } from "express";

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
    validate(querySearchSchema, "query"),
    validate(statusSearchSchema, "query"),
    validate(paginationQuerySchema, "query"),
    validate(bookingBusinessIdSchema, "params"),
    handler((req: Request) => {
        const query = req.query["query"] as string;
        const status = req.query["status"] as BookingFilterStatus;
        const page = parseInt(req.query["page"] as string, 10) || 1;
        const limit = parseInt(req.query["limit"] as string, 10) || 10;
        return getBusinessBookings(req.params["businessId"] as string, page, limit, query, status);
    }),
);

router.get(
    "/business/:businessId/status-counts",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(bookingBusinessIdSchema, "params"),
    handler((req: Request) => getBookingStatusCounts(req.params["businessId"] as string)),
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

router.patch(
    "/:id/reschedule",
    requireAuth,
    requireUserProfile,
    requireBusinessRole,
    validate(bookingIdSchema, "params"),
    validate(ownerRescheduleBookingSchema, "body"),
    handler((req: Request) => rescheduleBooking(req.params["id"] as string, req.body)),
);

export default router;
