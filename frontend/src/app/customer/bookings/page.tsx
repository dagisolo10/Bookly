"use client";

import { BookingsGrid } from "@/app/customer/_components/booking/bookings-grid";
import ListHeader from "@/components/shared/list-header";
import { BookingsGridSkeleton } from "@/components/shared/skeletons";
import { useSearchPagination } from "@/hooks/shared/use-search-pagination";
import { getMyBookingsQueryOptions } from "@/hooks/tan stack/query-options";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function MyBookings() {
    const { query, debouncedQuery, handleSearchChange } = useSearchPagination(10);

    const { data, isPending, isFetching, isError } = useQuery(
        getMyBookingsQueryOptions({
            placeholderData: keepPreviousData,
        }),
    );

    const filteredBookings = useMemo(() => {
        if (!data) return [];
        if (!debouncedQuery) return data;
        const q = debouncedQuery.toLowerCase();
        return data.filter(
            (booking) =>
                booking.service.name.toLowerCase().includes(q) ||
                booking.service.category.toLowerCase().includes(q) ||
                booking.status.toLowerCase().includes(q),
        );
    }, [data, debouncedQuery]);

    return (
        <div className="space-y-8">
            <ListHeader
                query={query}
                tag="My Appointments"
                title="My Bookings"
                isFetching={isFetching}
                onSearchChange={handleSearchChange}
                placeholder="Search bookings by service or status..."
                description="Manage your upcoming and past appointments. View details or cancel if needed."
            />

            {isPending ? (
                <BookingsGridSkeleton count={4} />
            ) : isError ? (
                <div className="flex min-h-[30vh] items-center justify-center">
                    <p className="text-destructive">Failed to load bookings. Please try again.</p>
                </div>
            ) : (
                <BookingsGrid bookings={filteredBookings} />
            )}
        </div>
    );
}
