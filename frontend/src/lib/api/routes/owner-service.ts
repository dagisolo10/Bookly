import { requestApi } from "@/lib/api/api-error";
import api from "@/lib/axios";
import { FullService } from "@/types/models";
import { CreateServicePayload, UpdateServicePayload } from "@/types/payload";
import { MessageResponse, PaginationResponse, ServiceResponse } from "@/types/response";

export const ownerServiceApi = {
    getBusinessServices: async (businessId: string, page: number, limit: number, query?: string) => {
        return requestApi(() => api.get<PaginationResponse<FullService>>(`/owner/service/business/${businessId}`, { params: { page, limit, query } }));
    },

    createService: async (service: CreateServicePayload) => {
        return requestApi(() => api.post<ServiceResponse>("/owner/service", service));
    },

    updateService: async (id: string, service: UpdateServicePayload) => {
        return requestApi(() => api.patch<ServiceResponse>(`/owner/service/${id}`, service));
    },

    toggleService: async (id: string) => {
        return requestApi(() => api.patch<MessageResponse>(`/owner/service/${id}/toggle`, undefined));
    },
};
