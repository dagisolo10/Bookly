import { requestApi } from "../api-error";

import api from "@/lib/axios";
import { BusinessHoursSchema } from "@/lib/validation";
import { FullBusiness } from "@/types/models";
import { BusinessResponse, MessageResponse, PaginationResponse } from "@/types/response";

export const ownerBusinessApi = {
    getMyBusinesses: async (page: number, limit: number, query?: string) => {
        const data = await requestApi(() => api.get<PaginationResponse<FullBusiness>>("/owner/business/my", { params: { page, limit, query } }));

        data.data.forEach((b) => BusinessHoursSchema.array().parse(b.hours));

        return data;
    },

    getMyBusinessById: async (id: string) => {
        const data = await requestApi(() => api.get<BusinessResponse>(`/owner/business/my/${id}`));

        BusinessHoursSchema.array().parse(data.hours);

        return data;
    },

    createBusiness: async (business: FormData) => {
        const data = await requestApi(() => api.post<BusinessResponse>("/owner/business", business));

        BusinessHoursSchema.array().parse(data.hours);

        return data;
    },

    updateBusiness: async (id: string, business: FormData) => {
        const data = await requestApi(() => api.patch<BusinessResponse>(`/owner/business/${id}`, business));

        BusinessHoursSchema.array().parse(data.hours);

        return data;
    },

    toggleBusiness: async (id: string) => {
        return requestApi(() => api.patch<MessageResponse>(`/owner/business/${id}/toggle`));
    },

    closeBusiness: async (id: string) => {
        return requestApi(() => api.patch<MessageResponse>(`/owner/business/${id}/close`));
    },
};
