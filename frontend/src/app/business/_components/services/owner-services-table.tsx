"use client";

import EmptyState from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatDuration } from "@/lib/helpers/formatters";
import { FullService } from "@/types/models";
import { ListRestart, LucideEllipsisVertical } from "lucide-react";

interface ServiceTableProps {
    hasServices: boolean;
    noSearchResult: boolean;
    services: FullService[];
    reset: () => void;
    handleAdd: () => void;
    handleEdit: (ser: FullService) => void;
    setToggleTarget: (ser: FullService) => void;
}

export default function ServicesTable({ hasServices, noSearchResult, services, handleEdit, handleAdd, setToggleTarget, reset }: ServiceTableProps) {
    const renderBody = () => {
        if (noSearchResult) {
            return (
                <TableRow>
                    <TableCell colSpan={7} className="h-72 text-center">
                        <EmptyState button="Reset" icon={ListRestart} title="No services found" description="No offerings match your search criteria. Try using alternative keywords." onClick={reset} />
                    </TableCell>
                </TableRow>
            );
        }

        if (!hasServices) {
            return (
                <TableRow>
                    <TableCell colSpan={7} className="h-72 text-center">
                        <EmptyState button="Add Service" title="No services yet" description="Get started by adding your first service offering." onClick={handleAdd} />
                    </TableCell>
                </TableRow>
            );
        }

        return services.map((service) => (
            <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.category ? <Badge variant="secondary">{service.category}</Badge> : <span className="text-muted-foreground text-sm">—</span>}</TableCell>
                <TableCell className="text-muted-foreground">{formatDuration(service.durationInMinutes)}</TableCell>
                <TableCell>${service.price.toFixed(2)}</TableCell>
                <TableCell>
                    <Badge variant={service.isActive ? "default" : "secondary"}>{service.isActive ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(service.createdAt)}</TableCell>
                <TableCell className="text-right">
                    <ServiceDropdownMenu isActive={service.isActive} onEdit={() => handleEdit(service)} onToggle={() => setToggleTarget(service)} />
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>{renderBody()}</TableBody>
        </Table>
    );
}

function ServiceDropdownMenu({ isActive, onEdit, onToggle }: { isActive: boolean; onEdit: () => void; onToggle: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <LucideEllipsisVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem variant={isActive ? "destructive" : "default"}>
                    <button type="button" className="w-full text-left" title="Service toggle button" onClick={onToggle}>
                        {isActive ? "Deactivate" : "Activate"}
                    </button>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <button type="button" className="w-full text-left" onClick={onEdit}>
                        Edit
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
