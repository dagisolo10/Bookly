import api from "@/lib/axios";
import { FullService } from "@/types/models";
import { PaginationResponse } from "@/types/response";
import { requestApi } from "../api-error";

export const customerServiceApi = {
    getServices: async (page: number, limit: number, query?: string) => {
        return requestApi(() => api.get<PaginationResponse<FullService>>("/customer/service", { params: { page, limit, query } }));
    },

    getBusinessServices: async (businessId: string, page: number, limit: number, query?: string) => {
        return requestApi(() => api.get<PaginationResponse<FullService>>(`/customer/service/business/${businessId}`, { params: { page, limit, query } }));
    },
};
