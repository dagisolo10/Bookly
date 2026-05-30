import { useSearchPagination } from "../shared/use-search-pagination";
import { getOwnerBusinessBookingsQueryOptions } from "../tan stack/query-options";

import { BookingFilterStatus } from "@/types/models";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export default function useBusinessBookings() {
    const { id: businessId } = useParams<{ id: string }>();

    const { query, currentPage, itemsPerPage, debouncedQuery, setCurrentPage, handleResetQuery, handleSearchChange, handleItemsPerPageChange } = useSearchPagination(5);

    const [statusFilter, setStatusFilter] = useState<BookingFilterStatus>("All");

    const { data, isFetching, isPending, error } = useQuery(
        getOwnerBusinessBookingsQueryOptions(businessId, currentPage, itemsPerPage, debouncedQuery || undefined, statusFilter, {
            placeholderData: keepPreviousData,
        }),
    );

    const bookingsData = data ?? { page: 1, total: 0, data: [], totalPages: 1, hasMore: false };

    return {
        error,
        query,
        isPending,
        isFetching,
        businessId,
        currentPage,
        itemsPerPage,
        statusFilter,
        bookingsData,
        setCurrentPage,
        setStatusFilter,
        handleResetQuery,
        handleSearchChange,
        ITEMS_PER_PAGE_OPTIONS,
        handleItemsPerPageChange,
    } as const;
}
