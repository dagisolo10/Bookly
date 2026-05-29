import { requestApi } from "../api-error";

import api from "@/lib/axios";
import { BookingStatusUpdate } from "@/types/payload";
import { BookingListResponse, BookingResponse } from "@/types/response";

export const ownerBookingApi = {
    getBookingById: async (id: string) => {
        return requestApi(() => api.get<BookingResponse>(`/owner/bookings/${id}`));
    },

    getBusinessBookings: async (businessId: string) => {
        return requestApi(() => api.get<BookingListResponse>(`/owner/bookings/business/${businessId}`));
    },

    manageBooking: async (id: string, newStatus: BookingStatusUpdate) => {
        return requestApi(() => api.patch<BookingResponse>(`/owner/bookings/${id}/manage`, newStatus));
    },
};
