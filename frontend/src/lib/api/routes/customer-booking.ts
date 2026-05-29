import api from "@/lib/axios";
import { CreateBookingPayload } from "@/types/payload";
import { FullBooking } from "@/types/models";
import { BookingResponse, PaginationResponse } from "@/types/response";
import { requestApi } from "../api-error";

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
};
