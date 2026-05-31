"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, CalendarDays, CalendarIcon, CheckCircle2, Clock, ImageIcon, Loader2, LucideIcon, Phone, Store, Tag, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import ErrorScreen from "@/components/shared/error-screen";
import NotFound from "@/components/shared/not-found";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { businessStatusStyles, statusStyles } from "@/constants/styles";
import useAvailableTimeSlots from "@/hooks/custom/use-available-slots";
import { getBookingQueryOptions, getBusinessQueryOptions } from "@/hooks/tan stack/query-options";
import { useCancelBooking, useRescheduleBooking } from "@/hooks/tan stack/use-customer-booking";
import { messageFromAxiosError } from "@/lib/api/api-error";
import { formatDateTime, formatDuration } from "@/lib/helpers/formatters";
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
    const rescheduleMutation = useRescheduleBooking();

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

    const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
    const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);

    const bookingQuery = useQuery(getBookingQueryOptions(bookingId));
    const booking = bookingQuery.data;
    const businessId = booking?.service?.businessId;

    const businessQuery = useQuery({
        ...getBusinessQueryOptions(businessId ?? ""),
        enabled: !!businessId,
    });

    const isPending = bookingQuery.isPending;
    const isError = bookingQuery.isError;

    const { isOpenDay, availableTimeSlots } = useAvailableTimeSlots({ date: rescheduleDate, duration: bookingQuery.data?.bookedDuration, hours: businessQuery.data?.hours });

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
            error: (err) => `Failed to cancel booking: ${err instanceof Error ? err.message : "Unknown error"}`,
        });
    };

    function handleRescheduleDateSelect(d: Date | undefined) {
        setRescheduleDate(d);
        setRescheduleTime(null);
    }

    function handleRescheduleOpenChange(isOpen: boolean) {
        setRescheduleDialogOpen(isOpen);
        if (!isOpen) {
            setRescheduleDate(undefined);
            setRescheduleTime(null);
        }
    }

    function handleReschedule() {
        if (!booking || !rescheduleDate || !rescheduleTime) return;

        const [hours, minutes] = rescheduleTime.split(":").map(Number) as [number, number];
        const year = rescheduleDate.getFullYear();
        const month = rescheduleDate.getMonth();
        const day = rescheduleDate.getDate();
        const startsAt = new Date(year, month, day, hours, minutes, 0).toISOString();

        toast.promise(rescheduleMutation.mutateAsync({ id: booking.id, data: { startsAt } }), {
            loading: "Rescheduling your appointment...",
            success: () => {
                handleRescheduleOpenChange(false);
                return "Appointment rescheduled successfully.";
            },
            error: (err) => messageFromAxiosError(err) || "Failed to reschedule booking.",
        });
    }

    const formattedRescheduleDate = rescheduleDate ? rescheduleDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : null;

    function isPastDate(d: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d < today;
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

                        {actions.length > 0 ? (
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

                    <Card className="p-0">
                        <CardContent className="p-8">
                            <h2 className="text-sm font-semibold">Booking Timeline</h2>
                            <div className="mt-6 space-y-0">
                                <TimelineStep icon={CheckCircle2} label="Booking Created" completed isLast={booking.status === "Pending"} />
                                {booking.status === "Pending" && <TimelineStep icon={Clock} label="Awaiting Confirmation" completed={false} isLast />}
                                {booking.status === "Confirmed" && <TimelineStep icon={CheckCircle2} label="Booking Confirmed" completed isLast />}
                                {booking.status === "Cancelled" && <TimelineStep icon={XCircle} label="Booking Cancelled" completed cancelled isLast />}
                                {booking.status === "Completed" && (
                                    <>
                                        <TimelineStep icon={CheckCircle2} label="Booking Confirmed" completed />
                                        <TimelineStep icon={CheckCircle2} label="Booking Completed" completed isLast />
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

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

            <Dialog open={rescheduleDialogOpen} onOpenChange={handleRescheduleOpenChange}>
                <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
                    <div className="px-4 pt-4">
                        <DialogHeader className="flex flex-col items-start gap-4 space-y-0">
                            <div className="flex-1">
                                <DialogTitle className="text-lg font-bold tracking-tight">Reschedule Booking</DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-1 text-xs">Choose a new date and time for this appointment.</DialogDescription>
                            </div>
                        </DialogHeader>
                    </div>

                    <div className="space-y-4 p-5">
                        <div className="space-y-2">
                            <Label className="text-xs">1. Select Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start gap-2 rounded-xl text-left text-xs font-normal shadow-2xs transition-all", rescheduleDate && "border-primary/40 ring-primary/10 bg-primary/1 ring-1")}>
                                        <CalendarIcon className="text-muted-foreground size-3.5 stroke-[1.5]" />
                                        {formattedRescheduleDate ? <span className="font-medium">{formattedRescheduleDate}</span> : <span className="text-muted-foreground">Choose an available date...</span>}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto overflow-hidden rounded-xl p-0 shadow-xl" align="start" side="left">
                                    <Calendar mode="single" selected={rescheduleDate} onSelect={handleRescheduleDateSelect} disabled={isPastDate} className="p-3 text-sm" />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className={cn("space-y-2 transition-all duration-300", !rescheduleDate && "pointer-events-none opacity-40 select-none")}>
                            <Label className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1">
                                    <span>2. Select Start Time</span>
                                </div>
                                {rescheduleDate && <span className={cn(isOpenDay ? "bg-emerald-500/10 text-emerald-500" : "text-destructive bg-destructive/10", "rounded-sm px-1.5 py-0.5 text-[10px] font-medium")}>{isOpenDay ? "Open" : "Closed"}</span>}
                            </Label>

                            <div className="scrollbar-thumb-foreground/20 scrollbar-track-background max-h-40 scrollbar-thin overflow-y-auto rounded-xl border p-2 pr-1">
                                {!rescheduleDate ? (
                                    <div className="flex h-20 flex-col items-center justify-center text-center">
                                        <p className="text-muted-foreground text-xs font-medium">Select a date.</p>
                                    </div>
                                ) : isOpenDay && availableTimeSlots.length > 0 ? (
                                    <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-2">
                                        {availableTimeSlots.map((slot) => {
                                            const isSelected = rescheduleTime === slot;
                                            return (
                                                <button key={slot} type="button" onClick={() => setRescheduleTime(slot)} className={cn("h-8 rounded-lg border text-xs font-medium shadow-2xs outline-hidden transition-all", isSelected ? "bg-foreground text-background font-bold" : "text-muted-foreground")}>
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex h-20 flex-col items-center justify-center text-center">
                                        <p className="text-muted-foreground text-xs font-medium">{isOpenDay ? "No available slots for this date." : "Shop is closed on this day."}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-5 py-3">
                        <DialogClose asChild>
                            <Button variant="ghost" size="lg" className="rounded-xl px-4 text-xs font-semibold">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleReschedule} disabled={!rescheduleDate || !rescheduleTime || rescheduleMutation.isPending} size="lg" className="min-w-32 gap-2 rounded-xl px-5 text-xs font-bold shadow-xs transition-all">
                            {rescheduleMutation.isPending ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    <span>Rescheduling...</span>
                                </>
                            ) : (
                                <span>Confirm Reschedule</span>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription>This will cancel your booking. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel} variant="destructive">
                            Cancel Booking
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

function TimelineStep({ icon: Icon, label, completed, cancelled, isLast = false }: { icon: LucideIcon; label: string; completed: boolean; cancelled?: boolean; isLast?: boolean }) {
    return (
        <div className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && <div className="bg-border absolute top-8 left-4 h-[calc(100%-2rem)] w-px -translate-x-1/2" />}
            <div className={cn("relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border", completed ? (cancelled ? "bg-destructive/10 text-destructive border-destructive/20" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600") : "bg-muted text-muted-foreground border-muted-foreground/20")}>
                <Icon className="size-4" />
            </div>
            <div className="flex flex-col justify-center">
                <p className={cn("text-sm font-medium", completed ? "text-foreground" : "text-muted-foreground")}>{label}</p>
            </div>
        </div>
    );
}

function BookingDetailSkeleton() {
    return (
        <div className="screen space-y-6">
            <Skeleton className="h-8 w-36 rounded-xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="space-y-6 p-8">
                            <div className="space-y-4">
                                <Skeleton className="h-5 w-48" />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Skeleton className="h-16 rounded-xl" />
                                    <Skeleton className="h-16 rounded-xl" />
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <Skeleton className="h-5 w-40" />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Skeleton className="h-16 rounded-xl" />
                                    <Skeleton className="h-16 rounded-xl" />
                                </div>
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-8">
                            <Skeleton className="h-5 w-36" />
                            <div className="mt-6 space-y-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="gap-4 overflow-hidden">
                        <CardHeader>
                            <Skeleton className="aspect-video w-full rounded-xl" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-48" />
                            <Separator />
                            <div className="space-y-2.5">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
