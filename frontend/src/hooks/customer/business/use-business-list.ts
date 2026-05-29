"use client";

import { useSearchPagination } from "@/hooks/shared/use-search-pagination";
import { getBusinessesQueryOptions } from "@/hooks/tan stack/query-options";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE_OPTIONS = [8, 16, 24, 32] as const;

export function useCustomerBusinessList() {
    const { query, currentPage, itemsPerPage, debouncedQuery, setCurrentPage, handleResetQuery, handleSearchChange, handleItemsPerPageChange } = useSearchPagination(8);

    const { data, isPending, error, isFetching } = useQuery(getBusinessesQueryOptions(currentPage, itemsPerPage, debouncedQuery || undefined, { placeholderData: keepPreviousData }));

    const businessData = data ?? { page: 1, total: 0, data: [], totalPages: 1, hasMore: false };

    return {
        query,
        error,
        isPending,
        isFetching,
        currentPage,
        businessData,
        itemsPerPage,
        setCurrentPage,
        handleResetQuery,
        handleSearchChange,
        ITEMS_PER_PAGE_OPTIONS,
        handleItemsPerPageChange,
        total: businessData.total,
        hasMore: businessData.hasMore,
        totalPages: businessData.totalPages,
    } as const;
}
