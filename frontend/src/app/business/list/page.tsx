"use client";
import BusinessGrid from "@/components/business/list/business-grid";
import BusinessListLoading from "@/components/business/loading/business-list-loading";
import ListPageHeader from "@/components/business/shared/list-page-header";
import PaginationContainer from "@/components/business/shared/pagination-container";
import EmptyState from "@/components/empty-state";
import { useBusinessList } from "@/hooks/business/use-business-list";
import { ListRestart } from "lucide-react";

export default function BusinessList() {
    const ubl = useBusinessList();

    if (ubl.isPending) {
        return <BusinessListLoading />;
    }

    if (ubl.error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Error: {ubl.error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ListPageHeader
                title="My Businesses"
                description="Manage your storefronts, view ratings, and update service listings."
                query={ubl.query}
                onSearchChange={ubl.handleSearchChange}
                isFetching={ubl.isFetching}
                placeholder="Search your businesses by name or city..."
                buttonLabel="Add Business"
                addHref="/business/new"
            />

            {(() => {
                if (ubl.businessData.data.length === 0) {
                    return (
                        <EmptyState
                            button="Add Business"
                            title="No businesses found"
                            onClick={ubl.handleAddBusiness}
                            description="Get started by registering your first business."
                        />
                    );
                }

                if (ubl.paginatedBusinesses.length === 0) {
                    return (
                        <EmptyState
                            button="Reset"
                            icon={ListRestart}
                            onClick={ubl.handleResetQuery}
                            title="No businesses match your search"
                            description="Try adjusting your keywords or location."
                        />
                    );
                }

                return (
                    <div>
                        <BusinessGrid businesses={ubl.paginatedBusinesses} linkPath="/business/list" />

                        <PaginationContainer
                            total={ubl.total}
                            hasMore={ubl.hasMore}
                            totalPages={ubl.totalPages}
                            currentPage={ubl.currentPage}
                            itemsPerPage={ubl.itemsPerPage}
                            setCurrentPage={ubl.setCurrentPage}
                            ITEMS_PER_PAGE_OPTIONS={ubl.ITEMS_PER_PAGE_OPTIONS}
                            onValueChange={(val) => ubl.handleItemsPerPageChange(val)}
                        />
                    </div>
                );
            })()}
        </div>
    );
}
