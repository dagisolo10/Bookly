import { ownerBusinessApi } from "@/lib/api/routes/owner-business";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateBusiness = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (business: FormData) => ownerBusinessApi.createBusiness(business),
        onSuccess: async (business) => {
            await queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
            queryClient.setQueryData(["owner", "business", business.id], business);
            router.push(`/business/list/${business.id}`);
        },
    });
};

export const useUpdateBusiness = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, business }: { id: string; business: FormData }) => ownerBusinessApi.updateBusiness(id, business),
        onSuccess: async (business) => {
            await queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
            await queryClient.invalidateQueries({ queryKey: ["owner", "business", business.id] });
            router.push(`/business/list/${business.id}`);
        },
    });
};

export const useToggleBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ownerBusinessApi.toggleBusiness(id),
        onSuccess: ({ message }, id) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
            queryClient.invalidateQueries({ queryKey: ["owner", "business", id] });
            toast.success(message);
        },
    });
};

export const useCloseBusiness = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ownerBusinessApi.closeBusiness(id),
        onSuccess: ({ message }, id) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "business", "list"] });
            queryClient.invalidateQueries({ queryKey: ["owner", "business", id] });
            toast.success(message);
            router.push("/business/list");
        },
    });
};
