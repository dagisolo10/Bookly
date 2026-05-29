"use client";

import { useSearchPagination } from "@/hooks/shared/use-search-pagination";
import { getBusinessServicesQueryOptions } from "@/hooks/tan stack/query-options";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export function useCustomerServices() {
    const { id: businessId } = useParams<{ id: string }>();

    const { query, currentPage, itemsPerPage, debouncedQuery, setCurrentPage, handleResetQuery, handleSearchChange, handleItemsPerPageChange } = useSearchPagination(10);

    const { data, isPending, isFetching, error } = useQuery(
        getBusinessServicesQueryOptions(businessId, currentPage, itemsPerPage, debouncedQuery || undefined, {
            placeholderData: keepPreviousData,
        }),
    );

    const servicesData = data ?? { page: 1, total: 0, data: [], totalPages: 1, hasMore: false };

    const cleanedQuery = query.trim().toLowerCase();
    const hasAnyServices = servicesData.data.length > 0;
    const showEmptySearch = servicesData.data.length === 0 && cleanedQuery.length > 0;

    return {
        error,
        query,
        isPending,
        isFetching,
        businessId,
        currentPage,
        itemsPerPage,
        servicesData,
        hasAnyServices,
        setCurrentPage,
        showEmptySearch,
        handleResetQuery,
        handleSearchChange,
        ITEMS_PER_PAGE_OPTIONS,
        handleItemsPerPageChange,
    } as const;
}
