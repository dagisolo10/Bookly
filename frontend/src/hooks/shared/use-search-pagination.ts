"use client";
import { useCallback, useState } from "react";

export function useSearchPagination(defaultItemsPerPage: number) {
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

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
        setCurrentPage(1);
    }, []);

    return {
        query,
        setQuery,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        handleSearchChange,
        handleItemsPerPageChange,
        handleResetQuery,
    } as const;
}
