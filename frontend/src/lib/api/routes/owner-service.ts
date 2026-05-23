import { hasApiError } from "@/lib/api/api-error";
import api from "@/lib/axios";
import { CreateServicePayload, UpdateServicePayload } from "@/types/payload";
import { MessageResponse, OwnerServiceResponse, OwnerServicesResponse } from "@/types/response";

export const ownerServiceApi = {
    getBusinessServices: async (businessId: string) => {
        const { data } = await api.get<OwnerServicesResponse>(`/owner/service/business/${businessId}`);

        if (hasApiError(data)) throw data;

        return data;
    },

    createService: async (service: CreateServicePayload) => {
        const { data } = await api.post<OwnerServiceResponse>("/owner/service", service);

        if (hasApiError(data)) throw data;

        return data;
    },

    updateService: async (id: string, service: UpdateServicePayload) => {
        const { data } = await api.patch<OwnerServiceResponse>(`/owner/service/${id}`, service);

        if (hasApiError(data)) throw data;

        return data;
    },

    toggleService: async (id: string) => {
        const { data } = await api.patch<MessageResponse>(`/owner/service/${id}/toggle`, undefined);

        if (hasApiError(data)) throw data;

        return data;
    },
};
