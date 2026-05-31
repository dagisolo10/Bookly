import { ownerBookingApi } from "@/lib/api/routes/owner-booking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingStatusUpdate, OwnerRescheduleBookingPayload } from "@/types/payload";

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

export const useOwnerRescheduleBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: OwnerRescheduleBookingPayload }) => ownerBookingApi.rescheduleBooking(id, data),
        onSuccess: (booking) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "booking", "list"] });
            queryClient.invalidateQueries({ queryKey: ["owner", "booking", booking.id] });
        },
    });
};

export const useOwnerAcceptRescheduleBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ownerBookingApi.acceptRescheduleBooking(id),
        onSuccess: (booking) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "booking", "list"] });
            queryClient.invalidateQueries({ queryKey: ["owner", "booking", booking.id] });
        },
    });
};

export const useOwnerDeclineRescheduleBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ownerBookingApi.declineRescheduleBooking(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "booking", "list"] });
            queryClient.invalidateQueries({ queryKey: ["owner", "booking", id] });
        },
    });
};
