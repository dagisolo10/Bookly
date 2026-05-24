"use client";

import { useBusinessServices } from "@/hooks/service/use-business-services";

import ServiceDialog from "@/components/business/services/service-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

import ListPageHeader from "@/components/business/shared/list-page-header";
import ServicesTable from "@/components/business/services/services-table";
import PaginationContainer from "@/components/business/shared/pagination-container";

export default function BusinessServicesPage() {
    const ubs = useBusinessServices();

    if (ubs.isPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (ubs.error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-destructive">Failed to load services. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ListPageHeader
                title="Services"
                description="Manage your business service offerings"
                query={ubs.query}
                onSearchChange={ubs.handleSearchChange}
                isFetching={ubs.isFetching}
                placeholder="Search services..."
                buttonLabel="Add Service"
                onAdd={ubs.handleAdd}
            />

            <div className="rounded-xl border">
                <ServicesTable
                    handleAdd={ubs.handleAdd}
                    handleEdit={ubs.handleEdit}
                    reset={() => ubs.setQuery("")}
                    services={ubs.filteredServices}
                    hasServices={ubs.hasAnyServices}
                    noSearchResult={ubs.showEmptySearch}
                    setToggleTarget={ubs.setToggleTarget}
                />

                <div className="border-t">
                    <PaginationContainer
                        currentPage={ubs.currentPage}
                        total={ubs.servicesData.total}
                        itemsPerPage={ubs.itemsPerPage}
                        hasMore={ubs.servicesData.hasMore}
                        setCurrentPage={ubs.setCurrentPage}
                        totalPages={ubs.servicesData.totalPages}
                        ITEMS_PER_PAGE_OPTIONS={ubs.ITEMS_PER_PAGE_OPTIONS}
                        onValueChange={(val) => ubs.handleItemsPerPageChange(val)}
                    />
                </div>
            </div>

            <ServiceDialog
                open={ubs.dialogOpen}
                mode={ubs.dialogMode}
                setOpen={ubs.setDialogOpen}
                businessId={ubs.businessId}
                service={ubs.editingService}
            />

            <AlertDialog open={!!ubs.toggleTarget} onOpenChange={(open) => !open && ubs.setToggleTarget(null)}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{ubs.toggleTarget?.isActive ? "Deactivate" : "Activate"} Service?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {ubs.toggleTarget?.isActive
                                ? "This service will be hidden from customers. Active confirmed bookings won't be affected."
                                : "This service will become visible and bookable by customers."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={ubs.isToggling}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={ubs.isToggling}
                            onClick={ubs.handleToggleConfirm}
                            variant={ubs.toggleTarget?.isActive ? "destructive" : "default"}
                        >
                            {ubs.isToggling ? (
                                <>
                                    <Spinner className="mr-1" />
                                    {ubs.toggleTarget?.isActive ? "Deactivating..." : "Activating..."}
                                </>
                            ) : ubs.toggleTarget?.isActive ? (
                                "Deactivate"
                            ) : (
                                "Activate"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
