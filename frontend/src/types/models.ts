export type User = {
    id: string;
    name: string;
    roles: Role[];
    createdAt: string;
    updatedAt: string;
};

export type Business = {
    id: string;
    name: string;
    timeZone: string;
    description: string | null;
    location: string | null;
    phone: string | null;
    bannerImages: string[];
    hours: BusinessHour[];
    status: BusinessStatus;
    createdAt: string;
    updatedAt: string;

    ownerId: string;
    services: Service[];
};

export type BusinessHour = {
    id: string;
    open: string;
    close: string;
    day: WeekDay;
    businessId: string;
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
};

export type Role = "Customer" | "Business" | "Admin";

export type BusinessStatus = "Active" | "Paused" | "Closed";

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type FullUser = User & {
    bookings: Booking[];
    businesses: Business[];
};

export type FullBusiness = Business & {
    services: Service[];
    hours: BusinessHour[];
};

export type FullService = Service & {
    bookings: Booking[];
};

export type FullBooking = Booking & {
    user: User;
    service: Service;
};
