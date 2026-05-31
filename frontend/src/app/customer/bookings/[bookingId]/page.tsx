"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, CalendarDays, Check, Clock, Loader2, Phone, Store, X, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import BookingTimeline from "@/app/customer/_components/booking/booking-timeline";
import ConfirmActionDialog from "@/components/shared/booking/confirm-action-dialog";
import RescheduleBookingDialog from "@/components/shared/booking/reschedule-booking-dialog";
import ServiceDetailCard from "@/components/shared/booking/service-detail-card";
import TimeFieldCard from "@/components/shared/booking/time-field-card";
import ErrorScreen from "@/components/shared/error-screen";
import NotFound from "@/components/shared/not-found";
import { BookingDetailSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { businessStatusStyles, statusStyles } from "@/constants/styles";
import { getBookingQueryOptions, getBusinessQueryOptions } from "@/hooks/tan stack/query-options";
import { useAcceptRescheduleBooking, useCancelBooking, useCustomerRescheduleBooking, useDeclineRescheduleBooking } from "@/hooks/tan stack/use-customer-booking";
import { messageFromAxiosError } from "@/lib/api/api-error";
import { formatDateTime } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/models";

type CustomerAction = "Reschedule" | "Cancel";

const allowedCustomerActions: Record<BookingStatus, CustomerAction[]> = {
    Pending: ["Reschedule", "Cancel"],
    Confirmed: ["Reschedule", "Cancel"],
    Cancelled: [],
    Completed: [],
};

export default function CustomerBookingDetailPage() {
    const { bookingId } = useParams<{ bookingId: string }>();

    const cancelMutation = useCancelBooking();
    const rescheduleMutation = useCustomerRescheduleBooking();
    const acceptRescheduleMutation = useAcceptRescheduleBooking();
    const declineRescheduleMutation = useDeclineRescheduleBooking();

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

    const bookingQuery = useQuery(getBookingQueryOptions(bookingId));
    const booking = bookingQuery.data;
    const businessId = booking?.service?.businessId;

    const businessQuery = useQuery({
        ...getBusinessQueryOptions(businessId ?? ""),
        enabled: !!businessId,
    });

    const isPending = bookingQuery.isPending;
    const isError = bookingQuery.isError;

    if (isPending) return <BookingDetailSkeleton />;
    if (isError) return <ErrorScreen message="Failed to load booking details." />;
    if (!booking) return <NotFound message="Booking not found." />;

    const business = businessQuery.data;
    const actions = allowedCustomerActions[booking.status];

    const handleCancel = () => {
        setCancelDialogOpen(false);
        toast.promise(cancelMutation.mutateAsync(booking.id), {
            loading: "Cancelling booking...",
            success: "Booking cancelled successfully",
            error: (err) => messageFromAxiosError(err) || "Failed to cancel booking.",
        });
    };

    function handleReschedule(startsAt: string) {
        toast.promise(rescheduleMutation.mutateAsync({ id: booking!.id, data: { startsAt } }), {
            loading: "Rescheduling your appointment...",
            success: () => {
                setRescheduleDialogOpen(false);
                return "Appointment rescheduled successfully.";
            },
            error: (err) => messageFromAxiosError(err) || "Failed to reschedule booking.",
        });
    }

    const hasPendingReschedule = !!booking.suggestedStartsAt;

    function handleAcceptReschedule() {
        toast.promise(acceptRescheduleMutation.mutateAsync(booking!.id), {
            loading: "Accepting reschedule...",
            success: "Reschedule accepted! Your appointment has been updated.",
            error: (err) => messageFromAxiosError(err) || "Failed to accept reschedule.",
        });
    }

    function handleDeclineReschedule() {
        toast.promise(declineRescheduleMutation.mutateAsync(booking!.id), {
            loading: "Declining reschedule...",
            success: "Reschedule declined.",
            error: (err) => messageFromAxiosError(err) || "Failed to decline reschedule.",
        });
    }

    return (
        <div className="space-y-6">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl text-xs font-medium">
                <Link href="/customer/bookings">
                    <ArrowLeft className="size-3.5" />
                    Back to Bookings
                </Link>
            </Button>

            <Card className="p-0">
                <CardContent className="p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Booking #{booking.id.slice(0, 8).toUpperCase()}</h1>
                                <Badge variant="outline" className={cn("rounded-md border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-2xs", statusStyles[booking.status])}>
                                    {booking.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">Booked on {formatDateTime(booking.createdAt)}</p>
                        </div>

                        {hasPendingReschedule ? (
                            <div className="flex items-center gap-4 sm:self-center">
                                {booking.suggestedBy === "Owner" && (
                                    <div className="text-muted-foreground flex items-center gap-1.5 rounded-lg border border-dashed border-amber-200 bg-amber-50 px-3 py-1.5 text-xs">
                                        <Clock className="size-3.5 text-amber-600" />
                                        <span className="font-medium text-amber-700">Reschedule proposed — pending your response</span>
                                    </div>
                                )}
                                {booking.suggestedBy === "Customer" && (
                                    <Button onClick={handleDeclineReschedule} variant="outline" className="hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 h-9 gap-1.5 rounded-xl border-zinc-200 px-4 text-xs font-semibold text-zinc-700 shadow-2xs transition-all" disabled={declineRescheduleMutation.isPending}>
                                        {declineRescheduleMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <XCircle className="size-3.5" />}
                                        Cancel
                                    </Button>
                                )}
                                {actions.includes("Reschedule") && (
                                    <Button onClick={() => setRescheduleDialogOpen(true)} variant="outline" className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-2xs transition-all">
                                        <CalendarDays className="size-3.5" />
                                        Reschedule Booking
                                    </Button>
                                )}
                            </div>
                        ) : actions.length > 0 ? (
                            <div className="flex items-center gap-4 sm:self-center">
                                {actions.includes("Reschedule") && (
                                    <Button onClick={() => setRescheduleDialogOpen(true)} variant="outline" className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-2xs transition-all">
                                        <CalendarDays className="size-3.5" />
                                        Reschedule Booking
                                    </Button>
                                )}
                                {actions.includes("Cancel") && (
                                    <Button onClick={() => setCancelDialogOpen(true)} variant="outline" className="hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 h-9 gap-1.5 rounded-xl border-zinc-200 px-4 text-xs font-semibold text-zinc-700 shadow-2xs transition-all">
                                        <XCircle className="size-3.5" />
                                        Cancel Booking
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-muted-foreground flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-xs">
                                <AlertCircle className="size-3.5" />
                                No actions available for this booking.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {hasPendingReschedule && (
                <Card className="border-amber-200 bg-amber-50/50 p-0">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Clock className="size-4 text-amber-600" />
                                <h3 className="text-sm font-bold text-amber-800">Reschedule Proposed</h3>
                            </div>
                            {booking.suggestedBy === "Owner" ? (
                                <>
                                    <p className="text-xs text-amber-700">
                                        The business proposed a new time: <span className="font-semibold">{formatDateTime(booking.suggestedStartsAt!)}</span>
                                        {booking.rescheduleReason && <> &mdash; Reason: {booking.rescheduleReason}</>}
                                    </p>
                                    <p className="text-[10px] text-amber-600">Accept the new time or decline to keep your current schedule.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs text-amber-700">
                                        You proposed a new time: <span className="font-semibold">{formatDateTime(booking.suggestedStartsAt!)}</span>
                                        {booking.rescheduleReason && <> &mdash; Reason: {booking.rescheduleReason}</>}
                                    </p>
                                    <p className="text-[10px] text-amber-600">Awaiting business response.</p>
                                </>
                            )}
                        </div>

                        {booking.suggestedBy === "Owner" && (
                            <div className="flex items-center gap-2">
                                <Button onClick={handleDeclineReschedule} variant="outline" size="lg" className="hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 h-9 gap-1.5 rounded-xl border-zinc-200 px-4 text-xs font-semibold text-zinc-700 shadow-2xs transition-all" disabled={declineRescheduleMutation.isPending}>
                                    {declineRescheduleMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
                                    Decline
                                </Button>
                                <Button onClick={handleAcceptReschedule} size="lg" className="h-9 gap-1.5 rounded-xl bg-amber-600 px-4 text-xs font-bold text-white shadow-2xs transition-all hover:bg-amber-700" disabled={acceptRescheduleMutation.isPending}>
                                    {acceptRescheduleMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                                    Accept New Time
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
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
                                <h2 className="text-sm font-semibold">Business Information</h2>
                                {business ? (
                                    <>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <TimeFieldCard label="Business Name" icon={Store} value={business.name} variant="emerald" />
                                            <TimeFieldCard label="Contact Number" icon={Phone} value={business.phone ?? "No Phone Available"} variant="amber" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">Status</span>
                                            <Badge variant="outline" className={cn("rounded-md border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-2xs", businessStatusStyles[business.status])}>
                                                {business.status}
                                            </Badge>
                                        </div>
                                    </>
                                ) : businessQuery.isFetching ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <Skeleton className="h-16 rounded-xl" />
                                            <Skeleton className="h-16 rounded-xl" />
                                        </div>
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-xs">Business information unavailable.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <BookingTimeline status={booking.status} />
                </div>

                <ServiceDetailCard thumbnail={booking.bookedThumbnail} category={booking.bookedCategory} name={booking.bookedServiceName} duration={booking.bookedDuration} price={booking.bookedPrice} />
            </div>

            <RescheduleBookingDialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen} onConfirm={handleReschedule} isPending={rescheduleMutation.isPending} bookedDuration={booking.bookedDuration} hours={business?.hours} description="Propose a new date and time for this appointment. The business will review your request." />

            <ConfirmActionDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen} onConfirm={handleCancel} title="Cancel Booking?" description="This will cancel your booking. This action cannot be undone." confirmLabel="Cancel Booking" cancelLabel="Keep Booking" variant="destructive" />
        </div>
    );
}
