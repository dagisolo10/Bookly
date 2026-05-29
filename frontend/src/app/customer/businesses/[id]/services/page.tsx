"use client";

import { ServicesGrid } from "@/app/customer/_components/services/services-grid";
import ListHeader from "@/components/shared/list-header";
import PaginationContainer from "@/components/shared/pagination-container";
import { ServicesGridSkeleton } from "@/components/shared/skeletons";
import { useSearchPagination } from "@/hooks/shared/use-search-pagination";
import { getBusinessQueryOptions, getBusinessServicesQueryOptions } from "@/hooks/tan stack/query-options";
import { keepPreviousData, useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ITEMS_PER_PAGE_OPTIONS = [9, 18, 27, 36] as const;

export default function CustomerBusinessServices() {
    const { id } = useParams<{ id: string }>();
    const { query, currentPage, itemsPerPage, debouncedQuery, setCurrentPage, handleSearchChange, handleItemsPerPageChange } = useSearchPagination(9);

    const [businessQuery, servicesQuery] = useQueries({
        queries: [
            getBusinessQueryOptions(id),
            getBusinessServicesQueryOptions(id, currentPage, itemsPerPage, debouncedQuery || undefined, {
                placeholderData: keepPreviousData,
            }),
        ],
    });

    const isPending = businessQuery.isPending;
    const serviceListFetching = servicesQuery.isFetching;
    const servicesData = servicesQuery.data ?? { page: 1, total: 0, data: [], totalPages: 1, hasMore: false };

    const hasError = [businessQuery, servicesQuery].some((q) => q.isError);

    if (!businessQuery.data) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Business not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ListHeader query={query} tag="Services for" title={businessQuery.data.name} isFetching={serviceListFetching} onSearchChange={handleSearchChange} placeholder="Search services by name..." description="Find and book the perfect service. From hair and beauty to specialized consultations, our experts are ready to serve you." />

            {isPending ? (
                <ServicesGridSkeleton count={6} />
            ) : hasError ? (
                <div className="flex min-h-[30vh] items-center justify-center">
                    <p className="text-destructive">Failed to load services. Please try again.</p>
                </div>
            ) : servicesData.data.length === 0 ? (
                <div className="flex min-h-[30vh] items-center justify-center">
                    <p className="text-muted-foreground">No services found.</p>
                </div>
            ) : (
                <div>
                    <ServicesGrid services={servicesData.data} />
                    <PaginationContainer total={servicesData.total} hasMore={servicesData.hasMore} totalPages={servicesData.totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} ITEMS_PER_PAGE_OPTIONS={ITEMS_PER_PAGE_OPTIONS} onValueChange={(val) => handleItemsPerPageChange(val)} />
                </div>
            )}
        </div>
    );
}
