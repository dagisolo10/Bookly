"use client";
import { Button } from "@//components/ui/button";
import BusinessGrid from "@/components/business/list/business-grid";
import BusinessListLoading from "@/components/business/loading/business-list-loading";
import PaginationContainer from "@/components/business/shared/pagination-container";
import EmptyState from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useBusinessList } from "@/hooks/business/use-business-list";
import { ListRestart, Plus, Search } from "lucide-react";
import Link from "next/link";

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Businesses</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your storefronts, view ratings, and update service listings.</p>
                </div>

                <Button asChild>
                    <Link href="/business/new">
                        <Plus className="size-4" />
                        Add Business
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative max-w-sm flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        id="query"
                        value={ubl.query}
                        className="pl-9"
                        onChange={(e) => ubl.handleSearchChange(e.target.value)}
                        placeholder="Search your businesses by name or city..."
                    />
                </div>
                {ubl.isFetching && <Spinner className="size-4" />}
            </div>

            {(() => {
                if (ubl.businesses.length === 0) {
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
