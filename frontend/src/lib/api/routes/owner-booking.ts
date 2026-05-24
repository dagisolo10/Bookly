import { requestApi } from "../api-error";

import api from "@/lib/axios";
import { BookingStatusUpdate } from "@/types/payload";
import { OwnerBookingListResponse, OwnerBookingResponse } from "@/types/response";

export const ownerBookingApi = {
    getBookingById: async (id: string) => {
        return requestApi(() => api.get<OwnerBookingResponse>(`/owner/bookings/${id}`));
    },

    getBusinessBookings: async (businessId: string) => {
        return requestApi(() => api.get<OwnerBookingListResponse>(`/owner/bookings/business/${businessId}`));
    },

    manageBooking: async (id: string, newStatus: BookingStatusUpdate) => {
        return requestApi(() => api.patch<OwnerBookingResponse>(`/owner/bookings/${id}/manage`, newStatus));
    },
};
