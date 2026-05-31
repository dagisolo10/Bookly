import { requestApi } from "../api-error";

import api from "@/lib/axios";
import { BookingFilterStatus, FullBooking } from "@/types/models";
import { BookingStatusUpdate, OwnerRescheduleBookingPayload } from "@/types/payload";
import { BookingResponse, BookingStatusCountsResponse, MessageResponse, PaginationResponse } from "@/types/response";

export const ownerBookingApi = {
    getBookingById: async (id: string) => {
        return requestApi(() => api.get<BookingResponse>(`/owner/bookings/${id}`));
    },

    getBusinessBookings: async (businessId: string, page: number, limit: number, query?: string, status?: BookingFilterStatus) => {
        return requestApi(() => api.get<PaginationResponse<FullBooking>>(`/owner/bookings/business/${businessId}`, { params: { page, limit, query, status } }));
    },

    getBookingStatusCounts: async (businessId: string) => {
        return requestApi(() => api.get<BookingStatusCountsResponse>(`/owner/bookings/business/${businessId}/status-counts`));
    },

    manageBooking: async (id: string, newStatus: BookingStatusUpdate) => {
        return requestApi(() => api.patch<BookingResponse>(`/owner/bookings/${id}/manage`, { newStatus }));
    },

    rescheduleBooking: async (id: string, data: OwnerRescheduleBookingPayload) => {
        return requestApi(() => api.patch<BookingResponse>(`/owner/bookings/${id}/reschedule`, data));
    },

    acceptRescheduleBooking: async (id: string) => {
        return requestApi(() => api.patch<BookingResponse>(`/owner/bookings/${id}/accept-reschedule`));
    },

    declineRescheduleBooking: async (id: string) => {
        return requestApi(() => api.patch<MessageResponse>(`/owner/bookings/${id}/decline-reschedule`));
    },
};
