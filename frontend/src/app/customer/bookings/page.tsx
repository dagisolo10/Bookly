"use client";

import { BookingsGrid } from "@/app/customer/_components/booking/bookings-grid";
import ErrorScreen from "@/components/shared/error-screen";
import ListHeader from "@/components/shared/list-header";
import NotFound from "@/components/shared/not-found";
import PaginationContainer from "@/components/shared/pagination-container";
import { BookingsGridSkeleton } from "@/components/shared/skeletons";
import { useSearchPagination } from "@/hooks/shared/use-search-pagination";
import { getMyBookingsQueryOptions } from "@/hooks/tan stack/query-options";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 30] as const;

export default function MyBookings() {
    const { query, currentPage, itemsPerPage, debouncedQuery, setCurrentPage, handleSearchChange, handleItemsPerPageChange } = useSearchPagination(10);

    const { data, isPending, isFetching, isError } = useQuery(
        getMyBookingsQueryOptions(currentPage, itemsPerPage, debouncedQuery || undefined, {
            placeholderData: keepPreviousData,
        }),
    );

    const bookingsData = data ?? { page: 1, total: 0, data: [], totalPages: 1, hasMore: false };

    return (
        <div className="space-y-8">
            <ListHeader
                query={query}
                tag="My Appointments"
                title="My Bookings"
                isFetching={isFetching}
                onSearchChange={handleSearchChange}
                placeholder="Search bookings by service name..."
                description="Manage your upcoming and past appointments. View details or cancel if needed."
            />

            {isPending ? (
                <BookingsGridSkeleton count={4} />
            ) : isError ? (
                <ErrorScreen message="Failed to load bookings. Please try again." />
            ) : bookingsData.data.length === 0 ? (
                <NotFound message="No bookings found." />
            ) : (
                <div>
                    <BookingsGrid bookings={bookingsData.data} />
                    <PaginationContainer total={bookingsData.total} hasMore={bookingsData.hasMore} totalPages={bookingsData.totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} ITEMS_PER_PAGE_OPTIONS={ITEMS_PER_PAGE_OPTIONS} onValueChange={(val) => handleItemsPerPageChange(val)} />
                </div>
            )}
        </div>
    );
}
