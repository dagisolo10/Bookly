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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import ServicesTable from "@/components/business/services/services-table";
import PaginationContainer from "@/components/business/shared/pagination-container";
import { Plus, Search } from "lucide-react";

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
                <p className="text-destructive">Failed to load services: {ubs.error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your business service offerings</p>
                </div>
                <Button onClick={ubs.handleAdd}>
                    <Plus className="size-4" />
                    Add Service
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative max-w-sm flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search services..."
                        value={ubs.query}
                        onChange={(e) => ubs.handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
                {ubs.isFetching && <Spinner className="size-4" />}
            </div>

            <div className="rounded-xl border">
                <ServicesTable
                    handleAdd={ubs.handleAdd}
                    handleEdit={ubs.handleEdit}
                    reset={() => ubs.setQuery("")}
                    hasServices={ubs.hasAnyServices}
                    services={ubs.paginatedServices}
                    noSearchResult={ubs.showEmptySearch}
                    setToggleTarget={ubs.setToggleTarget}
                />

                <div className="border-t">
                    <PaginationContainer
                        totalPages={ubs.totalPages}
                        currentPage={ubs.currentPage}
                        itemsPerPage={ubs.itemsPerPage}
                        setCurrentPage={ubs.setCurrentPage}
                        ITEMS_PER_PAGE_OPTIONS={ubs.ITEMS_PER_PAGE_OPTIONS}
                        onValueChange={(val) => ubs.handleItemsPerPageChange(val)}
                    />
                </div>
            </div>

            <ServiceDialog
                open={ubs.dialogOpen}
                setOpen={ubs.setDialogOpen}
                mode={ubs.dialogMode}
                service={ubs.editingService}
                businessId={ubs.businessId}
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
