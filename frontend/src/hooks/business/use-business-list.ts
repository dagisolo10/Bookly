"use client";

import { getOwnerBusinessesQueryOptions } from "@/hooks/tan stack/query-options";
import { useSearchPagination } from "@/hooks/shared/use-search-pagination";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

const ITEMS_PER_PAGE_OPTIONS = [8, 16, 24, 32] as const;

export function useBusinessList() {
    const { query, currentPage, setCurrentPage, itemsPerPage, handleSearchChange, handleItemsPerPageChange, handleResetQuery } =
        useSearchPagination(8);

    const { data, isPending, error, isFetching } = useQuery(getOwnerBusinessesQueryOptions({ page: currentPage, limit: itemsPerPage }));

    const businessData = data ?? {
        page: 1,
        total: 0,
        data: [],
        totalPages: 1,
        hasMore: false,
    };

    const router = useRouter();

    const handleAddBusiness = useCallback(() => {
        router.push("/business/new");
    }, [router]);

    const paginatedBusinesses = useMemo(() => {
        if (!query.trim()) return businessData.data;
        const q = query.toLowerCase();
        return businessData.data.filter((b) => b.name.toLowerCase().includes(q) || b.location?.toLowerCase().includes(q));
    }, [businessData.data, query]);

    return {
        businessData,
        businesses: businessData.data,
        total: businessData.total,
        hasMore: businessData.hasMore,
        isPending,
        error,
        isFetching,
        query,
        currentPage,
        itemsPerPage,
        paginatedBusinesses,
        totalPages: businessData.totalPages,
        ITEMS_PER_PAGE_OPTIONS,
        handleSearchChange,
        handleItemsPerPageChange,
        handleResetQuery,
        handleAddBusiness,
        setCurrentPage,
    } as const;
}
