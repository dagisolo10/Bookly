"use client";
import { useCallback, useEffect, useState } from "react";

export function useSearchPagination(defaultItemsPerPage: number) {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const handleItemsPerPageChange = useCallback((val: string) => {
        const parsed = Number.parseInt(val, 10);
        if (!Number.isFinite(parsed) || parsed <= 0) return;
        setItemsPerPage(parsed);
        setCurrentPage(1);
    }, []);

    const handleSearchChange = useCallback((val: string) => {
        setQuery(val);
        setCurrentPage(1);
    }, []);

    const handleResetQuery = useCallback(() => {
        setQuery("");
        setCurrentPage(1);
        setDebouncedQuery("");
    }, []);

    return {
        query,
        setQuery,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        debouncedQuery,
        handleResetQuery,
        handleSearchChange,
        handleItemsPerPageChange,
    } as const;
}
