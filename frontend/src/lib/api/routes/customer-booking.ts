import { requestApi } from "../api-error";

import api from "@/lib/axios";
import { FullBooking } from "@/types/models";
import { CreateBookingPayload, RescheduleBookingPayload } from "@/types/payload";
import { BookingResponse, MessageResponse, PaginationResponse } from "@/types/response";

export const customerBookingApi = {
    createBooking: async (booking: CreateBookingPayload) => {
        return requestApi(() => api.post<BookingResponse>("/customer/bookings", booking));
    },

    getMyBookings: async (page: number, limit: number, query?: string) => {
        return requestApi(() => api.get<PaginationResponse<FullBooking>>("/customer/bookings", { params: { page, limit, query } }));
    },

    getBookingById: async (id: string) => {
        return requestApi(() => api.get<BookingResponse>(`/customer/bookings/${id}`));
    },

    rescheduleBooking: async (id: string, data: RescheduleBookingPayload) => {
        return requestApi(() => api.patch<BookingResponse>(`/customer/bookings/${id}/reschedule`, data));
    },

    cancelBooking: async (id: string) => {
        return requestApi(() => api.patch<MessageResponse>(`/customer/bookings/${id}/cancel`));
    },
};
