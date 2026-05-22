import z from "zod";
import { BusinessHoursSchema } from "@/lib/validation";

export type User = {
    id: string;
    name: string;
    roles: Role[];
    createdAt: string;
    updatedAt: string;

    bookings: Booking[];
    businesses: Business[];
};

export type BusinessHour = z.infer<typeof BusinessHoursSchema>;

export type Business = {
    id: string;
    name: string;
    timeZone: string;
    description: string | null;
    location: string | null;
    phone: string | null;
    bannerImages: string[];
    status: BusinessStatus;
    createdAt: string;
    updatedAt: string;
    
    ownerId: string;
    services: Service[];
    hours: BusinessHour[];
};

export type Service = {
    id: string;
    name: string;
    durationInMinutes: number;
    price: number;
    thumbnail: string | null;
    isActive: boolean;
    category: string | null;
    createdAt: string;
    updatedAt: string;

    businessId: string;
    bookings: Booking[];
};

export type Booking = {
    id: string;
    name: string;
    phone: string;
    startsAt: string;
    createdAt: string;
    updatedAt: string;
    status: BookingStatus;

    serviceId: string;
    userId: string;

    user: User;
    service: Service;
};

export type Role = "Customer" | "Business" | "Admin";

export type BusinessStatus = "Active" | "Paused" | "Closed";

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";




