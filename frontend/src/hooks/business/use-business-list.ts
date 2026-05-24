"use client";

import { getOwnerBusinessesQueryOptions } from "@/hooks/tan stack/query-options";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const ITEMS_PER_PAGE_OPTIONS = [8, 16, 24, 32] as const;

export function useBusinessList() {
    const { data: businesses, isPending, error, isFetching } = useQuery(getOwnerBusinessesQueryOptions());

    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    const router = useRouter();

    const handleItemsPerPageChange = useCallback((val: string) => {
        setItemsPerPage(Number(val));
        setCurrentPage(1);
    }, []);

    const handleSearchChange = useCallback((val: string) => {
        setQuery(val);
        setCurrentPage(1);
    }, []);

    const handleResetQuery = useCallback(() => {
        setQuery("");
    }, []);

    const handleAddBusiness = useCallback(() => {
        router.push("/business/new");
    }, [router]);

    const displayBusinesses = useMemo(() => {
        if (!query.trim()) return businesses ?? [];
        const q = query.toLowerCase();
        return (businesses ?? []).filter(
            (b) => b.name.toLowerCase().includes(q) || b.location?.toLowerCase().includes(q),
        );
    }, [businesses, query]);

    const totalPages = useMemo(() => Math.ceil(displayBusinesses.length / itemsPerPage), [displayBusinesses.length, itemsPerPage]);

    const paginatedBusinesses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return displayBusinesses.slice(startIndex, startIndex + itemsPerPage);
    }, [displayBusinesses, currentPage, itemsPerPage]);

    return {
        businesses: businesses ?? [],
        isPending,
        error,
        isFetching,
        query,
        currentPage,
        itemsPerPage,
        paginatedBusinesses,
        totalPages,
        ITEMS_PER_PAGE_OPTIONS,
        handleSearchChange,
        handleItemsPerPageChange,
        handleResetQuery,
        handleAddBusiness,
        setCurrentPage,
    } as const;
}
