import api from "@/lib/axios";
import { ServiceListResponse } from "@/types/response";
import { requestApi } from "../api-error";

export const customerServiceApi = {
    getServices: async () => {
        return requestApi(() => api.get<ServiceListResponse>("/customer/service"));
    },

    getBusinessServices: async (businessId: string) => {
        return requestApi(() => api.get<ServiceListResponse>(`/customer/service/${businessId}`));
    },
};
