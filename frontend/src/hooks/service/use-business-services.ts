"use client";

import { useSearchPagination } from "@/hooks/shared/use-search-pagination";
import { getOwnerBusinessServicesQueryOptions } from "@/hooks/tan stack/query-options";
import { useToggleService } from "@/hooks/tan stack/use-owner-service";
import type { Service } from "@/types/models";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export function useBusinessServices() {
    const { id: businessId } = useParams<{ id: string }>();

    const {
        query,
        setQuery,
        currentPage,
        itemsPerPage,
        debouncedQuery,
        setCurrentPage,
        handleResetQuery,
        handleSearchChange,
        handleItemsPerPageChange,
    } = useSearchPagination(5);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

    const [toggleTarget, setToggleTarget] = useState<Service | null>(null);
    const [editingService, setEditingService] = useState<Service | undefined>();

    const { data, isPending, isFetching, error } = useQuery(
        getOwnerBusinessServicesQueryOptions(businessId, currentPage, itemsPerPage, debouncedQuery || undefined, {
            placeholderData: keepPreviousData,
        }),
    );

    const servicesData = data ?? { page: 1, total: 0, data: [], totalPages: 1, hasMore: false };

    const { mutate: toggleService, isPending: isToggling } = useToggleService();

    const cleanedQuery = query.trim().toLowerCase();
    const hasAnyServices = servicesData.data.length > 0;

    const showEmptySearch = servicesData.data.length === 0 && cleanedQuery.length > 0;

    const handleEdit = useCallback((service: Service) => {
        setEditingService(service);
        setDialogMode("edit");
        setDialogOpen(true);
    }, []);

    const handleAdd = useCallback(() => {
        setEditingService(undefined);
        setDialogMode("add");
        setDialogOpen(true);
    }, []);

    const handleToggleConfirm = useCallback(() => {
        if (!toggleTarget) return;
        toggleService({ serviceId: toggleTarget.id, businessId });
        setToggleTarget(null);
    }, [toggleTarget, toggleService, businessId]);

    return {
        servicesData,
        businessId,
        isPending,
        isFetching,
        error,
        isToggling,
        query,
        currentPage,
        itemsPerPage,
        dialogOpen,
        dialogMode,
        editingService,
        toggleTarget,
        showEmptySearch,
        hasAnyServices,
        ITEMS_PER_PAGE_OPTIONS,
        handleEdit,
        handleAdd,
        handleToggleConfirm,
        handleItemsPerPageChange,
        handleSearchChange,
        handleResetQuery,
        setDialogOpen,
        setToggleTarget,
        setCurrentPage,
        setQuery,
    } as const;
}
