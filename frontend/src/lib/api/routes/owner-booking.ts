import { hasApiError } from "../api-error";

import api from "@/lib/axios";
import { BookingStatusUpdate } from "@/types/payload";
import { OwnerBookingListResponse, OwnerBookingResponse } from "@/types/response";

export const ownerBookingApi = {
    getBookingById: async (id: string) => {
        const { data } = await api.post<OwnerBookingResponse>(`/owner/bookings/${id}`);

        if (hasApiError(data)) throw data.error;

        return data;
    },

    getBusinessBookings: async (businessId: string) => {
        const { data } = await api.get<OwnerBookingListResponse>(`/owner/bookings/business/${businessId}`);

        if (hasApiError(data)) throw data.error;

        return data;
    },

    manageBooking: async (id: string, newStatus: BookingStatusUpdate) => {
        const { data } = await api.patch<OwnerBookingResponse>(`/owner/bookings/${id}/manage`, newStatus);

        if (hasApiError(data)) throw data.error;

        return data;
    },
};
