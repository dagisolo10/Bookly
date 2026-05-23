import { ApiRequestError, messageFromAxiosError } from "@/lib/api/api-error";
import axios, { AxiosError } from "axios";

const baseURL = process.env["NEXT_PUBLIC_API_URL"];

if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

const api = axios.create({ withCredentials: true, baseURL });

const getUserId = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("userId");
    }
    throw new Error("UserId in headers is missing!");
};

api.interceptors.response.use(
    (res) => res,
    (err: unknown) => {
        const ax = err as AxiosError;
        const message = messageFromAxiosError(err);
        return Promise.reject(new ApiRequestError(message, ax.response?.status, ax.response?.data));
    },
);

api.interceptors.request.use((config) => {
    if (process.env.NODE_ENV === "production") {
        return config;
    }

    const userId = getUserId();
    if (userId) config.headers["userId"] = userId;
    return config;
});

let tokenResolver: (() => Promise<string | null>) | null = null;

export const injectTokenResolver = (resolver: () => Promise<string | null>) => {
    tokenResolver = resolver;
};

api.interceptors.request.use(async (config) => {
    if (tokenResolver) {
        try {
            const token = await tokenResolver();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Interceptor failed to resolve token:", error);
        }
    }
    return config;
});

export default api;
