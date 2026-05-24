import { hasApiError } from "../api-error";

import api from "@/lib/axios";
import { BusinessHoursSchema } from "@/lib/validation";
import { FullBusiness } from "@/types/models";
import { CreateBusinessPayload, UpdateBusinessPayload } from "@/types/payload";
import { MessageResponse, OwnerBusinessResponse, PaginationResponse } from "@/types/response";

export const ownerBusinessApi = {
    getMyBusinesses: async (page: number, limit: number) => {
        const { data } = await api.get<PaginationResponse<FullBusiness>>("/owner/business/my", {
            params: { page, limit },
        });

        if (hasApiError(data)) throw data;

        data.data.forEach((b) => BusinessHoursSchema.array().parse(b.hours));

        return data;
    },

    getMyBusinessById: async (id: string) => {
        const { data } = await api.get<OwnerBusinessResponse>(`/owner/business/my/${id}`);

        if (hasApiError(data)) throw data;

        BusinessHoursSchema.array().parse(data.hours);

        return data;
    },

    createBusiness: async (business: CreateBusinessPayload) => {
        const { data } = await api.post<OwnerBusinessResponse>("/owner/business", business);

        if (hasApiError(data)) throw data;

        BusinessHoursSchema.array().parse(data.hours);

        return data;
    },

    updateBusiness: async (id: string, business: UpdateBusinessPayload) => {
        const { data } = await api.patch<OwnerBusinessResponse>(`/owner/business/${id}`, business);

        if (hasApiError(data)) throw data;

        BusinessHoursSchema.array().parse(data.hours);

        return data;
    },

    toggleBusiness: async (id: string) => {
        const { data } = await api.patch<MessageResponse>(`/owner/business/${id}/toggle`);

        if (hasApiError(data)) throw data;

        return data;
    },

    closeBusiness: async (id: string) => {
        const { data } = await api.patch<MessageResponse>(`/owner/business/${id}/close`);

        if (hasApiError(data)) throw data;

        return data;
    },
};
