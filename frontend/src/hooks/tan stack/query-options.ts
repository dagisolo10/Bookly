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
    pagination: { page: number; limit: number },
    options?: QueryOptions<PaginatedData<FullBusiness>, TData, TError>,
) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "business", "list", pagination.page, pagination.limit],
        queryFn: () => ownerBusinessApi.getMyBusinesses(pagination.page, pagination.limit),
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
    pagination: { page: number; limit: number },
    options?: QueryOptions<PaginatedData<FullService>, TData, TError>,
) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "service", "list", businessId, pagination.page, pagination.limit],
        queryFn: () => ownerServiceApi.getBusinessServices(businessId, pagination.page, pagination.limit),
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
