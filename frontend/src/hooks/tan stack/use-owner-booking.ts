import { BookingStatusUpdate } from "@/types/payload";
import { ownerBookingApi } from "@/lib/api/routes/owner-booking";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useManageBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, newStatus }: { id: string; newStatus: BookingStatusUpdate }) => ownerBookingApi.manageBooking(id, newStatus),
        onSuccess: (booking) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "booking", booking.id] });
            queryClient.invalidateQueries({ queryKey: ["owner", "booking", "list", booking.service.businessId] });
        },
    });
};
