import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerBookingApi } from "@/lib/api/routes/customer-booking";
import { CreateBookingPayload, RescheduleBookingPayload } from "@/types/payload";

export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (booking: CreateBookingPayload) => customerBookingApi.createBooking(booking),
        onSuccess: (booking) => {
            queryClient.invalidateQueries({ queryKey: ["customer", "booking", "list"] });
            queryClient.invalidateQueries({ queryKey: ["customer", "booking", booking.id] });
        },
    });
};

export const useRescheduleBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RescheduleBookingPayload }) => customerBookingApi.rescheduleBooking(id, data),
        onSuccess: (booking) => {
            queryClient.invalidateQueries({ queryKey: ["customer", "booking", "list"] });
            queryClient.invalidateQueries({ queryKey: ["customer", "booking", booking.id] });
        },
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => customerBookingApi.cancelBooking(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["customer", "booking", "list"] });
            queryClient.invalidateQueries({ queryKey: ["customer", "booking", id] });
        },
    });
};
