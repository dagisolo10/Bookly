import { hasApiError } from "@/lib/api/api-error";
import api from "@/lib/axios";
import { FullService } from "@/types/models";
import { CreateServicePayload, UpdateServicePayload } from "@/types/payload";
import { MessageResponse, OwnerServiceResponse, PaginationResponse } from "@/types/response";

export const ownerServiceApi = {
    getBusinessServices: async (businessId: string, page: number, limit: number) => {
        const { data } = await api.get<PaginationResponse<FullService>>(`/owner/service/business/${businessId}`, {
            params: { page, limit },
        });

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
