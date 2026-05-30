import { customerBookingApi } from "@/lib/api/routes/customer-booking";
import { customerBusinessApi } from "@/lib/api/routes/customer-business";
import { customerServiceApi } from "@/lib/api/routes/customer-service";
import { ownerBookingApi } from "@/lib/api/routes/owner-booking";
import { ownerBusinessApi } from "@/lib/api/routes/owner-business";
import { ownerServiceApi } from "@/lib/api/routes/owner-service";
import { userApi } from "@/lib/api/routes/user";
import { BookingFilterStatus, FullBooking, FullBusiness, FullService, FullUser, PaginatedData } from "@/types/models";
import { UseQueryOptions, queryOptions } from "@tanstack/react-query";

type QueryOptions<TQueryFnData, TData = TQueryFnData, TError = Error> = Omit<UseQueryOptions<TQueryFnData, TError, TData>, "queryKey" | "queryFn">;

export function syncUserQueryOptions<TData = FullUser, TError = Error>(options?: QueryOptions<FullUser, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["user"],
        queryFn: userApi.getUser,
    });
}

/**
 * Owner query options
 */

export function getOwnerBusinessesQueryOptions<TData = PaginatedData<FullBusiness>, TError = Error>(page: number, limit: number, query?: string, options?: QueryOptions<PaginatedData<FullBusiness>, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "business", "list", page, limit, query],
        queryFn: () => ownerBusinessApi.getMyBusinesses(page, limit, query),
    });
}

export function getOwnerBusinessQueryOptions<TData = FullBusiness, TError = Error>(id: string, options?: QueryOptions<FullBusiness, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "business", id],
        queryFn: () => ownerBusinessApi.getMyBusinessById(id),
    });
}

export function getOwnerBusinessServicesQueryOptions<TData = PaginatedData<FullService>, TError = Error>(businessId: string, page: number, limit: number, query?: string, options?: QueryOptions<PaginatedData<FullService>, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "service", "list", businessId, page, limit, query],
        queryFn: () => ownerServiceApi.getBusinessServices(businessId, page, limit, query),
    });
}

export function getOwnerBusinessBookingsQueryOptions<TData = PaginatedData<FullBooking>, TError = Error>(businessId: string, page: number, limit: number, query?: string, status?: BookingFilterStatus, options?: QueryOptions<PaginatedData<FullBooking>, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "booking", "list", businessId, page, limit, query, status],
        queryFn: () => ownerBookingApi.getBusinessBookings(businessId, page, limit, query, status),
    });
}

export function getOwnerBookingQueryOptions<TData = FullBooking, TError = Error>(id: string, options?: QueryOptions<FullBooking, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["owner", "booking", id],
        queryFn: () => ownerBookingApi.getBookingById(id),
    });
}

/**
 * Customer query options
 */

export function getBusinessesQueryOptions<TData = PaginatedData<FullBusiness>, TError = Error>(page: number, limit: number, query?: string, options?: QueryOptions<PaginatedData<FullBusiness>, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["customer", "business", "list", page, limit, query],
        queryFn: () => customerBusinessApi.getBusinesses(page, limit, query),
    });
}

export function getBusinessQueryOptions<TData = FullBusiness, TError = Error>(id: string, options?: QueryOptions<FullBusiness, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["customer", "business", id],
        queryFn: () => customerBusinessApi.getBusinessById(id),
    });
}

export function getMyBookingsQueryOptions<TData = PaginatedData<FullBooking>, TError = Error>(page: number, limit: number, query?: string, options?: QueryOptions<PaginatedData<FullBooking>, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["customer", "booking", "list", page, limit, query],
        queryFn: () => customerBookingApi.getMyBookings(page, limit, query),
    });
}

export function getBookingQueryOptions<TData = FullBooking, TError = Error>(id: string, options?: QueryOptions<FullBooking, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["customer", "booking", id],
        queryFn: () => customerBookingApi.getBookingById(id),
    });
}

export function getServicesQueryOptions<TData = PaginatedData<FullService>, TError = Error>(page: number, limit: number, query?: string, options?: QueryOptions<PaginatedData<FullService>, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["customer", "service", "list", page, limit, query],
        queryFn: () => customerServiceApi.getServices(page, limit, query),
    });
}

export function getBusinessServicesQueryOptions<TData = PaginatedData<FullService>, TError = Error>(businessId: string, page: number, limit: number, query?: string, options?: QueryOptions<PaginatedData<FullService>, TData, TError>) {
    return queryOptions({
        ...options,
        queryKey: ["customer", "service", businessId, page, limit, query],
        queryFn: () => customerServiceApi.getBusinessServices(businessId, page, limit, query),
    });
}
