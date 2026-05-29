"use client";
import BusinessGrid from "@/components/shared/business/business-grid";
import EmptyState from "@/components/shared/empty-state";
import ListHeader from "@/components/shared/list-header";
import PaginationContainer from "@/components/shared/pagination-container";
import { BusinessListSkeleton } from "@/components/shared/skeletons";
import { useBusinessList } from "@/hooks/owner/business/use-business-list";
import { ListRestart } from "lucide-react";

export default function BusinessList() {
    const ubl = useBusinessList();

    if (ubl.isPending && !ubl.businessData.data) {
        return <BusinessListSkeleton />;
    }

    if (ubl.error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Error: {ubl.error.message}</p>
            </div>
        );
    }

    return (
        <div className="screen space-y-6">
            <ListHeader owner query={ubl.query} title="My Businesses" addHref="/business/new" buttonLabel="Add Business" isFetching={ubl.isFetching} onSearchChange={ubl.handleSearchChange} placeholder="Search your businesses by name or city..." description="Manage your storefronts, view ratings, and update service listings." />

            {ubl.businessData.data.length === 0 && !ubl.query ? (
                <EmptyState button="Add Business" title="No businesses found" onClick={ubl.handleAddBusiness} description="Get started by registering your first business." />
            ) : ubl.businessData.data.length === 0 ? (
                <EmptyState button="Reset" icon={ListRestart} onClick={ubl.handleResetQuery} title="No businesses match your search" description="Try adjusting your keywords or location." />
            ) : (
                <div>
                    <BusinessGrid businesses={ubl.businessData.data} linkPath="/business/list" />
                    <PaginationContainer total={ubl.total} hasMore={ubl.hasMore} totalPages={ubl.totalPages} currentPage={ubl.currentPage} itemsPerPage={ubl.itemsPerPage} setCurrentPage={ubl.setCurrentPage} ITEMS_PER_PAGE_OPTIONS={ubl.ITEMS_PER_PAGE_OPTIONS} onValueChange={(val) => ubl.handleItemsPerPageChange(val)} />
                </div>
            )}
        </div>
    );
}
