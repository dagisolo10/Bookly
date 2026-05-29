import { customerBookingApi } from "@/lib/api/routes/customer-booking";
import { CreateBookingPayload } from "@/types/payload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
