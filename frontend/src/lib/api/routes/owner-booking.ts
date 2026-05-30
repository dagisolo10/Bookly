import { requestApi } from "../api-error";

import api from "@/lib/axios";
import { BookingFilterStatus, FullBooking } from "@/types/models";
import { BookingStatusUpdate } from "@/types/payload";
import { BookingResponse, PaginationResponse } from "@/types/response";

export const ownerBookingApi = {
    getBookingById: async (id: string) => {
        return requestApi(() => api.get<BookingResponse>(`/owner/bookings/${id}`));
    },

    getBusinessBookings: async (businessId: string, page: number, limit: number, query?: string, status?: BookingFilterStatus) => {
        return requestApi(() => api.get<PaginationResponse<FullBooking>>(`/owner/bookings/business/${businessId}`, { params: { page, limit, query, status } }));
    },

    manageBooking: async (id: string, newStatus: BookingStatusUpdate) => {
        return requestApi(() => api.patch<BookingResponse>(`/owner/bookings/${id}/manage`, { newStatus }));
    },
};
