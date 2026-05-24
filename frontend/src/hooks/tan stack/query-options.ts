import { ownerBookingApi } from "@/lib/api/routes/owner-booking";
import { ownerBusinessApi } from "@/lib/api/routes/owner-business";
import { ownerServiceApi } from "@/lib/api/routes/owner-service";
import { userApi } from "@/lib/api/routes/user";
import { FullBooking, FullBusiness, FullService, FullUser, PaginatedData } from "@/types/models";
import { UseQueryOptions, queryOptions } from "@tanstack/react-query";

type QueryOptions<TQueryFnData, TData = TQueryFnData, TError = Error> = Omit<UseQueryOptions<TQueryFnData, TError, TData>, "queryKey" | "queryFn">;

export function syncUserQueryOptions<TData = FullUser, TError = Error>(options?: QueryOptions<FullUser, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["user"],
        queryFn: userApi.getUser,
    });
}

export function getOwnerBusinessesQueryOptions<TData = PaginatedData<FullBusiness>, TError = Error>(
    page: number,
    limit: number,
    query?: string,
    options?: QueryOptions<PaginatedData<FullBusiness>, TData, TError>,
) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "business", "list", page, limit, query],
        queryFn: () => ownerBusinessApi.getMyBusinesses(page, limit, query),
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

export function getOwnerBusinessServicesQueryOptions<TData = PaginatedData<FullService>, TError = Error>(
    businessId: string,
    page: number,
    limit: number,
    query?: string,
    options?: QueryOptions<PaginatedData<FullService>, TData, TError>,
) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "service", "list", businessId, page, limit, query],
        queryFn: () => ownerServiceApi.getBusinessServices(businessId, page, limit, query),
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
