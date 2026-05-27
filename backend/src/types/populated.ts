import type { Booking, Business, Prisma, BusinessHour as PrismaBusinessHour, Service, User } from "@prisma/client";

export type FullBooking = Booking & {
    user: User;
    service: Service;
};

export type FullBusiness = Business & {
    hours: PrismaBusinessHour[];
};

export type FullService = Service & {
    bookings: Booking[];
};

export type FullUser = User & {
    bookings: Booking[];
    businesses: Business[];
};

export const fullBookingIncludes = {
    user: true,
    service: true,
} satisfies Prisma.BookingInclude;

export const fullBusinessInclude = {
    hours: true,
} satisfies Prisma.BusinessInclude;

export const fullServiceInclude = {
    bookings: true,
} satisfies Prisma.ServiceInclude;

export const fullUserInclude = {
    bookings: true,
    businesses: true,
} satisfies Prisma.UserInclude;
