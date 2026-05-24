import { ownerBusinessApi } from "@/lib/api/routes/owner-business";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateBusinessPayload, UpdateBusinessPayload } from "@/types/payload";

export const useCreateBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (business: CreateBusinessPayload) => ownerBusinessApi.createBusiness(business),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
        },
    });
};

export const useUpdateBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, business }: { id: string; business: UpdateBusinessPayload }) => ownerBusinessApi.updateBusiness(id, business),
        onSuccess: (business) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
            queryClient.invalidateQueries({ queryKey: ["owner", "business", business.id] });
        },
    });
};

export const useToggleBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ownerBusinessApi.toggleBusiness(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
            queryClient.invalidateQueries({ queryKey: ["owner", "business", id] });
        },
    });
};

export const useCloseBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ownerBusinessApi.closeBusiness(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
            queryClient.invalidateQueries({ queryKey: ["owner", "business", id] });
        },
    });
};

