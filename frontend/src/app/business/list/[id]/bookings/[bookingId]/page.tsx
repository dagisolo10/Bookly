"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, CalendarDays, Check, CheckCircle2, Clock, ImageIcon, LucideIcon, Phone, Tag, User, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import NotificationPopover from "@/app/business/_components/notification-popover";
import ErrorScreen from "@/components/shared/error-screen";
import NotFound from "@/components/shared/not-found";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { statusStyles } from "@/constants/styles";
import { getOwnerBookingQueryOptions } from "@/hooks/tan stack/query-options";
import { useManageBooking } from "@/hooks/tan stack/use-owner-booking";
import { formatDateTime, formatDuration } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/models";
import { BookingStatusUpdate } from "@/types/payload";

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
    Pending: ["Cancelled", "Confirmed"],
    Confirmed: ["Cancelled", "Completed"],
    Cancelled: [],
    Completed: [],
};

type ActionButton = "Accept Booking" | "Reject" | "Complete";
type Action = Exclude<BookingStatus, "Pending">;

const actionButton: Record<Action, ActionButton> = {
    Confirmed: "Accept Booking",
    Cancelled: "Reject",
    Completed: "Complete",
};

const actionConfig: Record<Action, { icon: LucideIcon; className: string }> = {
    Confirmed: {
        icon: CheckCircle2,
        className: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark: dark:hover:bg-zinc-200",
    },
    Cancelled: {
        icon: XCircle,
        className: "border-zinc-200 text-zinc-700 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 dark:border-zinc-800 dark:text-zinc-300",
    },
    Completed: {
        icon: Check,
        className: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    },
};

export default function OwnerBookingDetailPage() {
    const { id, bookingId } = useParams<{ id: string; bookingId: string }>();
    const bookingQuery = useQuery(getOwnerBookingQueryOptions(bookingId));
    const { mutate: manage } = useManageBooking();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<BookingStatusUpdate | null>(null);

    const booking = bookingQuery.data;
    const isError = bookingQuery.isError;
    const isPending = bookingQuery.isPending;

    if (isPending) return <OwnerBookingSkeleton />;
    if (isError) return <ErrorScreen message="Failed to load booking details." />;
    if (!booking) return <NotFound message="Booking not found." />;

    const handleConfirm = () => {
        if (pendingStatus) {
            manage({ id: booking.id, newStatus: pendingStatus }, { onSuccess: () => toast.success(`Booking ${pendingStatus.toLowerCase()} successfully`) });
        }
        setDialogOpen(false);
        setPendingStatus(null);
    };

    const actions = allowedTransitions[booking.status];

    return (
        <div className="screen space-y-6">
            <div className="flex items-center justify-between">
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl text-xs font-medium">
                    <Link href={`/business/list/${id}/bookings`}>
                        <ArrowLeft className="size-3.5" />
                        Back to Bookings
                    </Link>
                </Button>

                <NotificationPopover />
            </div>

            <Card className="p-0">
                <CardContent className="p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Booking #{booking.id.slice(0, 8).toUpperCase()}</h1>
                                <Badge className={cn("rounded-md border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-2xs", statusStyles[booking.status])}>{booking.status}</Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">Received {formatDateTime(booking.createdAt)}</p>
                        </div>

                        {actions.length > 0 ? (
                            <div className="flex items-center gap-4 sm:self-center">
                                {actions.map((action) => {
                                    const actionKey = action as Action;
                                    const newStatus = action as BookingStatusUpdate;
                                    const config = actionConfig[actionKey];
                                    const Icon = config.icon;

                                    return (
                                        <Button
                                            key={action}
                                            onClick={() => {
                                                setPendingStatus(newStatus);
                                                setDialogOpen(true);
                                            }}
                                            variant={actionKey === "Cancelled" ? "outline" : "default"}
                                            className={cn("h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-2xs transition-all", config.className)}
                                        >
                                            <Icon className="size-3.5" />
                                            {actionButton[action as Action]}
                                        </Button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-muted-foreground flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-xs">
                                <AlertCircle className="size-3.5" />
                                No actions available for {booking.status} status.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
                <Card className="p-0">
                    <CardContent className="space-y-6 p-8">
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold">Appointment Assignment</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <TimeFieldCard label="Schedule Start Time" icon={CalendarDays} value={formatDateTime(booking.startsAt)} variant="emerald" />
                                <TimeFieldCard label="Estimated End Time" icon={Clock} value={formatDateTime(booking.endsAt)} variant="amber" />
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold">Customer Identity</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <TimeFieldCard label="Client Name" icon={User} value={booking.user.name} variant="emerald" />
                                <TimeFieldCard label="Contact Number" icon={Phone} value={booking.user.phone ?? "No Phone Verified"} variant="amber" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="gap-4 overflow-hidden">
                        <CardHeader>
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
                                {booking.bookedThumbnail ? (
                                    <Image src={booking.bookedThumbnail} alt={booking.bookedServiceName} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="360px" priority />
                                ) : (
                                    <div className="flex size-full items-center justify-center">
                                        <ImageIcon className="text-muted-foreground size-8" />
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
                                    <Tag className="size-2.5" /> {booking.bookedCategory}
                                </span>
                                <h3 className="text-base font-bold">{booking.bookedServiceName}</h3>
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-2.5 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium">Service Duration</span>
                                    <span className="flex items-center gap-1 font-semibold">
                                        <Clock className="text-muted-foreground size-3" /> {formatDuration(booking.bookedDuration)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground font-medium">Price</span>
                                    <span className="text-sm font-bold">${booking.bookedPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{pendingStatus === "Confirmed" ? "Accept Booking?" : pendingStatus === "Cancelled" ? "Reject Booking?" : "Complete Booking?"}</AlertDialogTitle>
                        <AlertDialogDescription>{pendingStatus === "Confirmed" ? "This will confirm the booking and notify the customer." : pendingStatus === "Cancelled" ? "This will cancel the booking and notify the customer. This action cannot be undone." : "Mark this booking as completed. This action cannot be undone."}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} variant={pendingStatus === "Cancelled" ? "destructive" : "default"}>
                            {pendingStatus === "Confirmed" ? "Accept" : pendingStatus === "Cancelled" ? "Reject" : "Complete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function TimeFieldCard({ label, icon: Icon, value, variant }: { label: string; icon: LucideIcon; value: string; variant: "emerald" | "amber" }) {
    return (
        <div className="flex items-center gap-3.5 rounded-xl border p-4">
            <div className={cn("rounded-xl border p-2.5", variant === "emerald" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600" : "border-amber-500/20 bg-amber-500/5 text-amber-600")}>
                <Icon className="size-4 stroke-2" />
            </div>
            <div className="flex-1 font-semibold">
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">{label}</p>
                <p className="mt-0.5 truncate text-xs">{value}</p>
            </div>
        </div>
    );
}

function OwnerBookingSkeleton() {
    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
            <Skeleton className="h-8 w-36 rounded-xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="space-y-6 p-6">
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                        </CardContent>
                    </Card>
                </div>

                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
    );
}
