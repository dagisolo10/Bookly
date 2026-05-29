"use client";
import BusinessGrid from "@/components/shared/business/business-grid";
import EmptyState from "@/components/shared/empty-state";
import ErrorScreen from "@/components/shared/error-screen";
import ListHeader from "@/components/shared/list-header";
import PaginationContainer from "@/components/shared/pagination-container";
import { BusinessListSkeleton } from "@/components/shared/skeletons";
import { useCustomerBusinessList } from "@/hooks/customer/business/use-business-list";
import { ListRestart } from "lucide-react";

export default function CustomerBusinessList() {
    const { total, hasMore, totalPages, query, isPending, error, isFetching, currentPage, businessData, itemsPerPage, setCurrentPage, handleResetQuery, handleSearchChange, ITEMS_PER_PAGE_OPTIONS, handleItemsPerPageChange } = useCustomerBusinessList();

    if (isPending && !businessData.data) {
        return <BusinessListSkeleton />;
    }

    if (error) {
        return <ErrorScreen message={error.message} />;
    }

    return (
        <div className="space-y-6">
            <ListHeader query={query} title="Businesses" isFetching={isFetching} onSearchChange={handleSearchChange} placeholder="Search businesses by name or city..." description="Find businesses, view ratings, and book appointments." />
            {businessData.data.length === 0 && !query ? (
                <EmptyState title="No businesses found" description="No businesses are available right now. Check back later." />
            ) : businessData.data.length === 0 ? (
                <EmptyState button="Reset" icon={ListRestart} onClick={handleResetQuery} title="No businesses match your search" description="Try adjusting your keywords or location." />
            ) : (
                <div>
                    <BusinessGrid businesses={businessData.data} linkPath="/customer/businesses" />
                    <PaginationContainer total={total} hasMore={hasMore} totalPages={totalPages} currentPage={currentPage} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} ITEMS_PER_PAGE_OPTIONS={ITEMS_PER_PAGE_OPTIONS} onValueChange={(val) => handleItemsPerPageChange(val)} />
                </div>
            )}
        </div>
    );
}
