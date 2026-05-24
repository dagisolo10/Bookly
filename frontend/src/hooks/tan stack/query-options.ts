import { ownerBookingApi } from "@/lib/api/routes/owner-booking";
import { ownerBusinessApi } from "@/lib/api/routes/owner-business";
import { ownerServiceApi } from "@/lib/api/routes/owner-service";
import { userApi } from "@/lib/api/routes/user";
import { FullBooking, FullBusiness, FullService, FullUser } from "@/types/models";
import { queryOptions, UseQueryOptions } from "@tanstack/react-query";

type QueryOptions<TQueryFnData, TData = TQueryFnData, TError = Error> = Omit<UseQueryOptions<TQueryFnData, TError, TData>, "queryKey" | "queryFn">;

export function syncUserQueryOptions<TData = FullUser, TError = Error>(options?: QueryOptions<FullUser, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["user"],
        queryFn: userApi.getUser,
    });
}

export function getOwnerBusinessesQueryOptions<TData = FullBusiness[], TError = Error>(options?: QueryOptions<FullBusiness[], TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "business", "list"],
        queryFn: ownerBusinessApi.getMyBusinesses,
    });
}

export function getOwnerBusinessByIdQueryOptions<TData = FullBusiness, TError = Error>(
    id: string,
    options?: QueryOptions<FullBusiness, TData, TError>,
) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "business", id],
        queryFn: () => ownerBusinessApi.getMyBusinessById(id),
    });
}

export function getOwnerBusinessServicesQueryOptions<TData = FullService[], TError = Error>(
    businessId: string,
    pagination?: { page?: number; limit?: number },
    options?: QueryOptions<FullService[], TData, TError>,
) {
    const queryKey: unknown[] = ["owner", "service", "list", businessId];
    if (pagination?.page || pagination?.limit) {
        queryKey.push({ page: pagination.page, limit: pagination.limit });
    }
    return queryOptions({
        ...options,
        queryKey,
        queryFn: () => ownerServiceApi.getBusinessServices(businessId, pagination?.page, pagination?.limit),
    });
}

export function getBusinessBookingsQueryOptions<TData = FullBooking[], TError = Error>(
    businessId: string,
    options?: QueryOptions<FullBooking[], TData, TError>,
) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "booking", "list", businessId],
        queryFn: () => ownerBookingApi.getBusinessBookings(businessId),
    });
}

export function getBusinessBookingByIdQueryOptions<TData = FullBooking[], TError = Error>(
    id: string,
    options?: QueryOptions<FullBooking, TData, TError>,
) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "booking", id],
        queryFn: () => ownerBookingApi.getBookingById(id),
    });
}
