import { UserPayload } from "@/types/payload";
import { userApi } from "@/lib/api/routes/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: UserPayload) => userApi.updateUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};

export const useBecomeBusinessOwner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => userApi.becomeBusinessOwner(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};
