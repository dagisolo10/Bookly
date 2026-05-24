"use client";

import { getOwnerBusinessServicesQueryOptions } from "@/hooks/tan stack/query-options";
import { useToggleService } from "@/hooks/tan stack/use-owner-service";
import type { Service } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export function useBusinessServices() {
    const { id: businessId } = useParams<{ id: string }>();

    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [editingService, setEditingService] = useState<Service | undefined>();
    const [toggleTarget, setToggleTarget] = useState<Service | null>(null);

    const {
        data: services,
        isPending,
        isFetching,
        error,
    } = useQuery(getOwnerBusinessServicesQueryOptions(businessId, { page: currentPage, limit: itemsPerPage }));

    const { mutate: toggleService, isPending: isToggling } = useToggleService();

    const hasAnyServices = services ? services.length > 0 : false;
    const cleanedQuery = query.trim().toLowerCase();

    const displayServices = useMemo(() => {
        if (!services) return [];
        if (!cleanedQuery) return services;
        return services.filter(
            (s) => s.name.toLowerCase().includes(cleanedQuery) || (s.category && s.category.toLowerCase().includes(cleanedQuery)),
        );
    }, [services, cleanedQuery]);

    const totalServices = displayServices.length;
    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalServices / itemsPerPage)), [totalServices, itemsPerPage]);

    const safePage = Math.min(currentPage, totalPages);

    const paginatedServices = useMemo(() => {
        const start = (safePage - 1) * itemsPerPage;
        return displayServices.slice(start, start + itemsPerPage) ?? [];
    }, [displayServices, safePage, itemsPerPage]);

    const showEmptySearch = hasAnyServices && paginatedServices.length === 0 && cleanedQuery.length > 0;

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

    return {
        businessId,
        services: services ?? [],
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
        paginatedServices,
        totalPages,
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
