"use client";

import { useBusinessServices } from "@/hooks/owner/service/use-business-services";

import ServiceDialog from "@/app/business/_components/services/owner-service-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

import ServicesTable from "@/app/business/_components/services/owner-services-table";
import ErrorScreen from "@/components/shared/error-screen";
import ListHeader from "@/components/shared/list-header";
import PaginationContainer from "@/components/shared/pagination-container";
import { ServicesTableSkeleton } from "@/components/shared/skeletons";

export default function OwnerServicesList() {
    const ubs = useBusinessServices();

    if (ubs.isPending && !ubs.servicesData.data) {
        return <ServicesTableSkeleton />;
    }

    if (ubs.error) {
        return <ErrorScreen message="Failed to load services. Please try again." />;
    }

    return (
        <div className="screen space-y-6">
            <ListHeader owner title="Services" description="Manage your business service offerings" query={ubs.query} onSearchChange={ubs.handleSearchChange} isFetching={ubs.isFetching} placeholder="Search services..." buttonLabel="Add Service" onAdd={ubs.handleAdd} />

            <div className="rounded-xl border">
                <ServicesTable handleAdd={ubs.handleAdd} handleEdit={ubs.handleEdit} reset={() => ubs.setQuery("")} services={ubs.servicesData.data} hasServices={ubs.hasAnyServices} noSearchResult={ubs.showEmptySearch} setToggleTarget={ubs.setToggleTarget} />

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

            <ServiceDialog open={ubs.dialogOpen} mode={ubs.dialogMode} setOpen={ubs.setDialogOpen} businessId={ubs.businessId} service={ubs.editingService} />

            <AlertDialog open={!!ubs.toggleTarget} onOpenChange={(open) => !open && ubs.setToggleTarget(null)}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{ubs.toggleTarget?.isActive ? "Deactivate" : "Activate"} Service?</AlertDialogTitle>
                        <AlertDialogDescription>{ubs.toggleTarget?.isActive ? "This service will be hidden from customers. Active confirmed bookings won't be affected." : "This service will become visible and bookable by customers."}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={ubs.isToggling}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={ubs.isToggling} onClick={ubs.handleToggleConfirm} variant={ubs.toggleTarget?.isActive ? "destructive" : "default"}>
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
