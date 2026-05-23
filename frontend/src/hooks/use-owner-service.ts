import { ownerServiceApi } from "@/lib/api/routes/owner-service";
import { CreateServicePayload, UpdateServicePayload } from "@/types/payload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (service: CreateServicePayload) => ownerServiceApi.createService(service),
        onSuccess: (service) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "service", "list", service.businessId] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, service }: { id: string; service: UpdateServicePayload }) => ownerServiceApi.updateService(id, service),
        onSuccess: (service) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "service", service.id] });
            queryClient.invalidateQueries({ queryKey: ["owner", "business", service.businessId] });
            queryClient.invalidateQueries({ queryKey: ["owner", "service", "list", service.businessId] });
        },
    });
};

export const useToggleService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ serviceId }: { serviceId: string; businessId: string }) => ownerServiceApi.toggleService(serviceId),
        onSuccess: ({ message }, { serviceId, businessId }) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "service", serviceId] });
            queryClient.invalidateQueries({ queryKey: ["owner", "service", "list", businessId] });

            toast.success(message);
            // if (service.thumbnail) {
            //     const { error: storageError } = await supabase.storage.from("banners").remove([service.thumbnail]);
            //     if (storageError) {
            //         const message = storageError.message ?? "Storage deletion failed";
            //         throw new Error(message);
            //     }
            // }
        },
    });
};
