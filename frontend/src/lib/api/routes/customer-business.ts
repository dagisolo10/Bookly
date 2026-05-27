import api from "@/lib/axios";
import { BusinessListResponse, BusinessResponse } from "@/types/response";
import { requestApi } from "../api-error";

export const customerBusinessApi = {
    getBusinesses: async () => {
        return requestApi(() => api.get<BusinessListResponse>("/customer/business"));
    },

    getBusinessById: async (id: string) => {
        return requestApi(() => api.get<BusinessResponse>(`/customer/business/${id}`));
    },
};
