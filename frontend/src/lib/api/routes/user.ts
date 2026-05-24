import { requestApi } from "../api-error";

import api from "@/lib/axios";
import { UserPayload } from "@/types/payload";
import { UserResponse } from "@/types/response";

export const userApi = {
    getUser: async () => {
        return requestApi(() => api.get<UserResponse>("/user/me"));
    },

    updateUser: async (user: UserPayload) => {
        return requestApi(() => api.patch<UserResponse>("/user", user));
    },

    becomeBusinessOwner: async () => {
        return requestApi(() => api.post<UserResponse>("/user/become-owner"));
    },
};
