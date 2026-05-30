"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, SearchX } from "lucide-react";
import Link from "next/link";

import AnalyticsCards from "@/app/business/_components/analytics-cards";
import ErrorScreen from "@/components/shared/error-screen";
import PaginationContainer from "@/components/shared/pagination-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { statusStyles } from "@/constants/styles";
import { getOwnerBookingStatusCountsQueryOptions } from "@/hooks/tan stack/query-options";
import useBusinessBookings from "@/hooks/owner/use-business-bookings";
import { formatDateTime, formatDuration } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";
import type { BookingFilterStatus, BookingStatusCounts } from "@/types/models";

const defaultCounts: BookingStatusCounts = { All: 0, Pending: 0, Confirmed: 0, Cancelled: 0, Completed: 0 };
const statuses: BookingFilterStatus[] = ["All", "Pending", "Confirmed", "Cancelled", "Completed"];

export default function OwnerBusinessBookings() {
    const ubb = useBusinessBookings();
    const countsQuery = useQuery(getOwnerBookingStatusCountsQueryOptions(ubb.businessId));

    return (
        <div className="screen space-y-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
                <p className="text-muted-foreground mt-1 text-sm">Manage all incoming bookings for your business.</p>
            </div>

            <AnalyticsCards counts={countsQuery.data ?? defaultCounts} isPending={countsQuery.isPending} />

            {ubb.error ? (
                <ErrorScreen message="Failed to load bookings. Please try again." />
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="relative max-w-sm flex-1">
                                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
                                <Input placeholder="Search by customer or service..." value={ubb.query} onChange={(e) => ubb.handleSearchChange(e.target.value)} className="h-9 rounded-lg pl-9 text-xs" />
                            </div>
                            {ubb.isFetching && <Spinner className="size-4" />}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {statuses.map((status: BookingFilterStatus) => (
                                <button key={status} type="button" onClick={() => ubb.handleStatusFilterChange(status)} className={cn("cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", ubb.statusFilter === status ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted bg-transparent")}>
                                    {status === "All" ? "All" : status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ubb.isPending ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array.from({ length: 7 }).map((_, j) => (
                                                <TableCell key={j}>
                                                    <Skeleton className="h-4 w-20" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : ubb.bookingsData.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Empty className="border-0">
                                                <EmptyMedia variant="icon">
                                                    <SearchX className="size-5" />
                                                </EmptyMedia>
                                                <EmptyHeader>
                                                    <EmptyTitle>No bookings found</EmptyTitle>
                                                    <EmptyDescription>Try adjusting your filters or search terms.</EmptyDescription>
                                                </EmptyHeader>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ubb.bookingsData.data.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{booking.bookedServiceName}</TableCell>
                                            <TableCell className="font-medium">${booking.bookedPrice.toFixed(2)}</TableCell>
                                            <TableCell className="text-muted-foreground">{formatDuration(booking.bookedDuration)}</TableCell>
                                            <TableCell className="text-muted-foreground">{formatDateTime(booking.startsAt)}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("text-[10px] font-semibold tracking-wide uppercase", statusStyles[booking.status])}>
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
                                                    <Link href={`/business/list/${ubb.businessId}/bookings/${booking.id}`}>Manage</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="border-t">
                        <PaginationContainer
                            currentPage={ubb.currentPage}
                            total={ubb.bookingsData.total}
                            itemsPerPage={ubb.itemsPerPage}
                            hasMore={ubb.bookingsData.hasMore}
                            setCurrentPage={ubb.setCurrentPage}
                            totalPages={ubb.bookingsData.totalPages}
                            ITEMS_PER_PAGE_OPTIONS={ubb.ITEMS_PER_PAGE_OPTIONS}
                            onValueChange={(val) => ubb.handleItemsPerPageChange(val)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
