import { ownerServiceApi } from "@/lib/api/routes/owner-service";
import { CreateServicePayload, UpdateServicePayload } from "@/types/payload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
            queryClient.invalidateQueries({ queryKey: ["owner", "service", "list", service.businessId] });
        },
    });
};

export const useToggleService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ serviceId }: { serviceId: string; businessId: string }) => ownerServiceApi.toggleService(serviceId),
        onSuccess: (_, { businessId }) => {
            queryClient.invalidateQueries({ queryKey: ["owner", "service", "list", businessId] });
        },
    });
};
