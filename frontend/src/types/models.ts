import z from "zod";
import { BusinessHoursSchema } from "@/lib/validation";

/**
 * Base Models
 */

export type BannerUpload = {
    id: string;
    file: File;
    previewUrl: string;
};

export type BusinessHour = z.infer<typeof BusinessHoursSchema>;

export type User = {
    id: string;
    name: string;
    phone?: string | null;
    roles: Role[];
    createdAt: string;
    updatedAt: string;
};

export type Business = {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    phone: string | null;
    bannerImages: string[];
    status: BusinessStatus;
    createdAt: string;
    updatedAt: string;

    ownerId: string;
};

export type Service = {
    id: string;
    name: string;
    durationInMinutes: number;
    price: number;
    thumbnail: string | null;
    isActive: boolean;
    category: string;
    createdAt: string;
    updatedAt: string;

    businessId: string;
};

export type Booking = {
    id: string;
    startsAt: string;
    endsAt: string;
    bookedPrice: number;
    bookedDuration: number;
    bookedCategory: string;
    bookedServiceName: string;
    bookedThumbnail: string | null;
    createdAt: string;
    updatedAt: string;
    status: BookingStatus;

    userId: string;
    serviceId: string;
};

/**
 * Relation Models
 */

export type FullUser = User & {
    bookings: Booking[];
    businesses: Business[];
};

export type FullService = Service & {
    bookings: Booking[];
};

export type FullBusiness = Business & {
    hours: BusinessHour[];
};

export type FullBooking = Booking & {
    user: User;
    service: Service;
};

export type Role = "Customer" | "Business" | "Admin";

export type BusinessStatus = "Active" | "Paused" | "Closed";

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type PaginatedData<T> = {
    data: T[];
    total: number;
    hasMore: boolean;
    totalPages: number;
};

export type BookingFilterStatus = BookingStatus | "All"

export type BookingStatusCounts = Record<BookingFilterStatus, number>