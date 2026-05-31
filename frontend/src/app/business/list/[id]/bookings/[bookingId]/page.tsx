"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, CalendarDays, Check, CheckCircle2, Clock, Loader2, LucideIcon, Phone, User, X, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import NotificationPopover from "@/app/business/_components/notification-popover";
import ConfirmActionDialog from "@/components/shared/booking/confirm-action-dialog";
import RescheduleBookingDialog from "@/components/shared/booking/reschedule-booking-dialog";
import ServiceDetailCard from "@/components/shared/booking/service-detail-card";
import TimeFieldCard from "@/components/shared/booking/time-field-card";
import ErrorScreen from "@/components/shared/error-screen";
import NotFound from "@/components/shared/not-found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { statusStyles } from "@/constants/styles";
import { getBusinessQueryOptions, getOwnerBookingQueryOptions } from "@/hooks/tan stack/query-options";
import { useManageBooking, useOwnerAcceptRescheduleBooking, useOwnerDeclineRescheduleBooking, useOwnerRescheduleBooking } from "@/hooks/tan stack/use-owner-booking";
import { messageFromAxiosError } from "@/lib/api/api-error";
import { formatDateTime } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/models";
import { BookingStatusUpdate } from "@/types/payload";
import { OwnerBookingDetailSkeleton } from "@/components/shared/skeletons";

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
        className: "bg-zinc-900 text-white hover:bg-zinc-800",
    },
    Cancelled: {
        icon: XCircle,
        className: "border-zinc-200 text-zinc-700 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30",
    },
    Completed: {
        icon: Check,
        className: "bg-emerald-600 text-white hover:bg-emerald-700",
    },
};

const loadingMessages: Record<Action, string> = {
    Confirmed: "Accepting booking...",
    Cancelled: "Cancelling booking...",
    Completed: "Marking booking as complete...",
};

const errorMessages: Record<Action, string> = {
    Confirmed: "accept",
    Cancelled: "cancel",
    Completed: "complete",
};

const dialogContent: Record<BookingStatusUpdate, { title: string; description: string; action: string }> = {
    Confirmed: {
        title: "Accept Booking?",
        description: "This will confirm the booking and notify the customer.",
        action: "Accept",
    },
    Cancelled: {
        title: "Reject Booking?",
        description: "This will cancel the booking and notify the customer. This action cannot be undone.",
        action: "Reject",
    },
    Completed: {
        title: "Complete Booking?",
        description: "Mark this booking as completed. This action cannot be undone.",
        action: "Complete",
    },
};

export default function OwnerBookingDetailPage() {
    const { id, bookingId } = useParams<{ id: string; bookingId: string }>();
    const bookingQuery = useQuery(getOwnerBookingQueryOptions(bookingId));
    const { mutateAsync: manage } = useManageBooking();
    const rescheduleMutation = useOwnerRescheduleBooking();
    const { mutateAsync: acceptReschedule, isPending: isAccepting } = useOwnerAcceptRescheduleBooking();
    const { mutateAsync: declineReschedule, isPending: isDeclining } = useOwnerDeclineRescheduleBooking();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<BookingStatusUpdate | null>(null);
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

    const booking = bookingQuery.data;
    const isError = bookingQuery.isError;
    const isPending = bookingQuery.isPending;

    const businessId = booking?.service?.businessId;
    const businessQuery = useQuery({
        ...getBusinessQueryOptions(businessId ?? ""),
        enabled: !!businessId,
    });

    if (isPending) return <OwnerBookingDetailSkeleton />;
    if (isError) return <ErrorScreen message="Failed to load booking details." />;
    if (!booking) return <NotFound message="Booking not found." />;

    const safeBooking = booking;

    function handleAcceptReschedule() {
        toast.promise(acceptReschedule(safeBooking.id), {
            loading: "Accepting reschedule...",
            success: "Reschedule accepted! Appointment has been updated.",
            error: (err) => messageFromAxiosError(err) || "Failed to accept reschedule.",
        });
    }

    function handleDeclineReschedule() {
        toast.promise(declineReschedule(safeBooking.id), {
            loading: "Declining reschedule...",
            success: "Reschedule declined.",
            error: (err) => messageFromAxiosError(err) || "Failed to decline reschedule.",
        });
    }

    const handleConfirm = () => {
        if (pendingStatus) {
            toast.promise(manage({ id: booking.id, newStatus: pendingStatus }), {
                loading: loadingMessages[pendingStatus] || "Updating booking...",
                success: `Booking ${pendingStatus.toLowerCase()} successfully`,
                error: (error) => `Failed to ${errorMessages[pendingStatus]} booking: ${error.message}`,
            });
        } else {
            setDialogOpen(false);
            setPendingStatus(null);
        }
    };

    function handleReschedule(suggestedStartsAt: string) {
        toast.promise(rescheduleMutation.mutateAsync({ id: booking!.id, data: { suggestedStartsAt } }), {
            loading: "Proposing new schedule...",
            success: () => {
                setRescheduleDialogOpen(false);
                return "Reschedule proposed to customer.";
            },
            error: (err) => messageFromAxiosError(err) || "Failed to reschedule booking.",
        });
    }

    const actions = allowedTransitions[booking.status];
    const canReschedule = booking.status === "Pending" || booking.status === "Confirmed";

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

                        {booking.suggestedStartsAt ? (
                            <div className="flex items-center gap-4 sm:self-center">
                                {booking.suggestedBy === "Customer" && (
                                    <div className="text-muted-foreground flex items-center gap-1.5 rounded-lg border border-dashed border-blue-200 bg-blue-50 px-3 py-1.5 text-xs">
                                        <Clock className="size-3.5 text-blue-600" />
                                        <span className="font-medium text-blue-700">Reschedule proposed — pending your response</span>
                                    </div>
                                )}

                                {booking.suggestedBy === "Owner" && (
                                    <Button onClick={handleDeclineReschedule} variant="outline" className="hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 h-9 gap-1.5 rounded-xl border-zinc-200 px-4 text-xs font-semibold text-zinc-700 shadow-2xs transition-all" disabled={isDeclining}>
                                        {isDeclining ? <Loader2 className="size-3.5 animate-spin" /> : <XCircle className="size-3.5" />}
                                        Cancel
                                    </Button>
                                )}
                                {canReschedule && (
                                    <Button onClick={() => setRescheduleDialogOpen(true)} variant="outline" className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-2xs transition-all">
                                        <CalendarDays className="size-3.5" />
                                        Reschedule
                                    </Button>
                                )}
                            </div>
                        ) : actions.length > 0 || canReschedule ? (
                            <div className="flex items-center gap-4 sm:self-center">
                                {canReschedule && (
                                    <Button onClick={() => setRescheduleDialogOpen(true)} variant="outline" className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-2xs transition-all">
                                        <CalendarDays className="size-3.5" />
                                        Reschedule
                                    </Button>
                                )}
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
                                            {actionButton[actionKey]}
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

            {booking.suggestedStartsAt && (
                <Card className="border-blue-200 bg-blue-50/50 p-0">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Clock className="size-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-blue-800">Reschedule Proposed</h3>
                            </div>
                            {booking.suggestedBy === "Customer" ? (
                                <>
                                    <p className="text-xs text-blue-700">
                                        The customer proposed a new time: <span className="font-semibold">{formatDateTime(booking.suggestedStartsAt)}</span>
                                        {booking.rescheduleReason && <> &mdash; Reason: {booking.rescheduleReason}</>}
                                    </p>
                                    <p className="text-[10px] text-blue-600">Accept the new time or decline to keep the current schedule.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs text-blue-700">
                                        You proposed a new time: <span className="font-semibold">{formatDateTime(booking.suggestedStartsAt)}</span>
                                        {booking.rescheduleReason && <> &mdash; Reason: {booking.rescheduleReason}</>}
                                    </p>
                                    <p className="text-[10px] text-blue-600">Awaiting customer response.</p>
                                </>
                            )}
                        </div>

                        {booking.suggestedBy === "Customer" && (
                            <div className="flex items-center gap-2">
                                <Button onClick={handleDeclineReschedule} variant="outline" size="lg" className="hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 h-9 gap-1.5 rounded-xl border-zinc-200 px-4 text-xs font-semibold text-zinc-700 shadow-2xs transition-all" disabled={isDeclining}>
                                    {isDeclining ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
                                    Decline
                                </Button>

                                <Button onClick={handleAcceptReschedule} size="lg" className="h-9 gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-2xs transition-all hover:bg-blue-700" disabled={isAccepting}>
                                    {isAccepting ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                                    Accept New Time
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
                <Card className="p-0">
                    <CardContent className="space-y-6 p-8">
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold">Appointment Assignment</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <TimeFieldCard label="Schedule Start Time" icon={CalendarDays} value={formatDateTime(booking.startsAt)} variant="emerald" />
                                <TimeFieldCard label="Estimated End Time" icon={Clock} value={formatDateTime(booking.endsAt)} variant="amber" />
                            </div>
                            {booking.suggestedStartsAt && booking.suggestedEndsAt && (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <TimeFieldCard label="Proposed New Time" icon={CalendarDays} value={formatDateTime(booking.suggestedStartsAt)} variant="amber" />
                                    <TimeFieldCard label="Proposed New End" icon={Clock} value={formatDateTime(booking.suggestedEndsAt)} variant="amber" />
                                </div>
                            )}
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

                <ServiceDetailCard thumbnail={booking.bookedThumbnail} category={booking.bookedCategory} name={booking.bookedServiceName} duration={booking.bookedDuration} price={booking.bookedPrice} />
            </div>

            <RescheduleBookingDialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen} onConfirm={handleReschedule} isPending={rescheduleMutation.isPending} bookedDuration={booking.bookedDuration} hours={businessQuery.data?.hours} description="Propose a new date and time for this appointment. The customer will be notified." />

            <ConfirmActionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleConfirm}
                title={pendingStatus ? dialogContent[pendingStatus].title : ""}
                description={pendingStatus ? dialogContent[pendingStatus].description : ""}
                confirmLabel={pendingStatus ? dialogContent[pendingStatus].action : ""}
                cancelLabel="Cancel"
                variant={pendingStatus === "Cancelled" ? "destructive" : "default"}
            />
        </div>
    );
}
