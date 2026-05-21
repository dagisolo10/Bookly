import { BusinessHour } from "./models";

export type UserPayload = {
    name: string;
};

type WorkingHour = Omit<BusinessHour, "id" | "businessId">;

export type CreateBusinessPayload = {
    name: string;
    hours: WorkingHour[];
    bannerImages: string[];
    timeZone: string;
    phone?: string | null | undefined;
    location?: string | null | undefined;
    description?: string | null | undefined;
};

export type UpdateBusinessPayload = {
    name?: string | undefined;
    hours?: WorkingHour[] | undefined;
    phone?: string | null | undefined;
    location?: string | null | undefined;
    description?: string | null | undefined;
    bannerImages?: string[] | undefined;
    timeZone?: string | undefined;
};

export type CreateServicePayload = {
    name: string;
    durationInMinutes: number;
    price: number;
    businessId: string;
    category: string;
    thumbnail?: string | null | undefined;
};

export type UpdateServicePayload = {
    name?: string | undefined;
    durationInMinutes?: number | undefined;
    price?: number | undefined;
    thumbnail?: string | null | undefined;
    category?: string | undefined;
};

export type BookingStatusUpdate = "Confirmed" | "Cancelled" | "Completed";
