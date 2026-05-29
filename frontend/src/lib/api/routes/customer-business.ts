import api from "@/lib/axios";
import { FullBusiness } from "@/types/models";
import { BusinessResponse, PaginationResponse } from "@/types/response";
import { requestApi } from "../api-error";

export const customerBusinessApi = {
    getBusinesses: async (page: number, limit: number, query?: string) => {
        return requestApi(() => api.get<PaginationResponse<FullBusiness>>("/customer/business", { params: { page, limit, query } }));
    },

    getBusinessById: async (id: string) => {
        return requestApi(() => api.get<BusinessResponse>(`/customer/business/${id}`));
    },
};
