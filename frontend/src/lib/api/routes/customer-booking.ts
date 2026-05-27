import api from "@/lib/axios";
import { CreateBookingPayload } from "@/types/payload";
import { BookingListResponse, BookingResponse } from "@/types/response";
import { requestApi } from "../api-error";

export const customerBookingApi = {
    createBooking: async (booking: CreateBookingPayload) => {
        return requestApi(() => api.post<BookingResponse>("/customer/bookings", booking));
    },

    getMyBookings: async () => {
        return requestApi(() => api.get<BookingListResponse>("/customer/bookings"));
    },

    getBookingById: async (id: string) => {
        return requestApi(() => api.get<BookingResponse>(`/customer/bookings/${id}`));
    },
};
