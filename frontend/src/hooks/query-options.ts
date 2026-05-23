import { userApi } from "@/lib/api/routes/user";
import { ownerBookingApi } from "@/lib/api/routes/owner-booking";
import { ownerServiceApi } from "@/lib/api/routes/owner-service";
import { ownerBusinessApi } from "@/lib/api/routes/owner-business";
import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { FullBooking, FullBusiness, FullService, FullUser } from "@/types/models";

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
    options?: QueryOptions<FullService[], TData, TError>,
) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "service", "list", businessId],
        queryFn: () => ownerServiceApi.getBusinessServices(businessId),
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
