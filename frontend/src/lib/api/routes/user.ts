import { hasApiError } from "../api-error";

import api from "@/lib/axios";
import { UserPayload } from "@/types/payload";
import { UserResponse } from "@/types/response";

export const userApi = {
    getMe: async () => {
        const { data } = await api.get<UserResponse>("/user/me");

        if (hasApiError(data)) throw data.error;

        return data;
    },

    createUser: async (user: UserPayload) => {
        const { data } = await api.post<UserResponse>("/user", user);

        if (hasApiError(data)) throw data.error;

        return data;
    },

    updateUser: async (user: UserPayload) => {
        const { data } = await api.patch<UserResponse>("/user", user);

        if (hasApiError(data)) throw data.error;

        return data;
    },

    becomeBusinessOwner: async () => {
        const { data } = await api.post<UserResponse>("/user/become-owner");

        if (hasApiError(data)) throw data.error;

        return data;
    },
};
