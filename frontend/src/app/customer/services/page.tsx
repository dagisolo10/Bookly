"use client";

import { ServicesGrid } from "@/app/customer/_components/services/services-grid";
import ErrorScreen from "@/components/shared/error-screen";
import ListHeader from "@/components/shared/list-header";
import NotFound from "@/components/shared/not-found";
import PaginationContainer from "@/components/shared/pagination-container";
import { ServicesGridSkeleton } from "@/components/shared/skeletons";
import { useSearchPagination } from "@/hooks/shared/use-search-pagination";
import { getServicesQueryOptions } from "@/hooks/tan stack/query-options";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE_OPTIONS = [9, 18, 27, 36] as const;

export default function CustomerServicesPage() {
    const { query, currentPage, itemsPerPage, debouncedQuery, setCurrentPage, handleSearchChange, handleItemsPerPageChange } = useSearchPagination(9);

    const { data, isPending, isFetching, isError } = useQuery(
        getServicesQueryOptions(currentPage, itemsPerPage, debouncedQuery || undefined, {
            placeholderData: keepPreviousData,
        }),
    );

    const servicesData = data ?? { page: 1, total: 0, data: [], totalPages: 1, hasMore: false };

    return (
        <div className="space-y-8">
            <ListHeader query={query} tag="Premium Experiences" title="Professional Services" isFetching={isFetching} onSearchChange={handleSearchChange} placeholder="Search services by name..." description="Find and book the perfect service. From hair and beauty to specialized consultations, our experts are ready to serve you." />

            {isPending ? (
                <ServicesGridSkeleton count={6} />
            ) : isError ? (
                <ErrorScreen message="Failed to load services. Please try again." />
            ) : servicesData.data.length === 0 ? (
                <NotFound message="No services found." />
            ) : (
                <div>
                    <ServicesGrid services={servicesData.data} />
                    <PaginationContainer total={servicesData.total} hasMore={servicesData.hasMore} totalPages={servicesData.totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} ITEMS_PER_PAGE_OPTIONS={ITEMS_PER_PAGE_OPTIONS} onValueChange={(val) => handleItemsPerPageChange(val)} />
                </div>
            )}
        </div>
    );
}
