import { ownerBusinessApi } from "@/lib/api/routes/owner-business";
import { UpdateBusinessPayload } from "@/types/payload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateBusiness = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (business: FormData) => ownerBusinessApi.createBusiness(business),
        onSuccess: (business) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
            queryClient.setQueryData(["owner", "business", business.id], business);
            router.push(`/business/list/${business.id}`);
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
