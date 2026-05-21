import api from "@/lib/axios";
import { hasApiError } from "@/lib/api/api-error";
import { MessageResponse, OwnerServiceResponse } from "@/types/response";
import { CreateServicePayload, UpdateServicePayload } from "@/types/payload";

export const ownerServiceApi = {
    createService: async (service: CreateServicePayload) => {
        const { data } = await api.post<OwnerServiceResponse>("/owner/service", service);

        if (hasApiError(data)) throw data.error;

        return data;
    },

    updateService: async (id: string, service: UpdateServicePayload) => {
        const { data } = await api.patch<OwnerServiceResponse>(`/owner/service/${id}`, service);

        if (hasApiError(data)) throw data.error;

        return data;
    },

    toggleService: async (id: string) => {
        const { data } = await api.patch<MessageResponse>(`/owner/service/${id}/toggle`, undefined);

        if (hasApiError(data)) throw data.error;

        return data;
    },
};
