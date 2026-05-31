"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useAvailableTimeSlots from "@/hooks/custom/use-available-slots";
import { getBusinessQueryOptions } from "@/hooks/tan stack/query-options";
import { useCreateBooking } from "@/hooks/tan stack/use-customer-booking";
import { messageFromAxiosError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";
import type { FullService } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Clock, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface BookingSheetProps {
    service: FullService | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BookingSheet({ open, onOpenChange, service }: BookingSheetProps) {
    const { data: business } = useQuery(getBusinessQueryOptions(service?.businessId ?? "", { enabled: Boolean(service?.businessId) }));

    const router = useRouter();

    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const { mutateAsync: createBooking, isPending } = useCreateBooking();

    const { isOpenDay, availableTimeSlots } = useAvailableTimeSlots({ date, duration: service?.durationInMinutes, hours: business?.hours });

    function handleDateSelect(d: Date | undefined) {
        setDate(d);
        setSelectedTime(null);
    }

    function handleBook() {
        if (!service || !date || !selectedTime) return;

        const [hours, minutes] = selectedTime.split(":").map(Number) as [number, number];
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const startsAt = new Date(year, month, day, hours, minutes, 0).toISOString();

        toast.promise(createBooking({ startsAt, serviceId: service.id }), {
            loading: "Securing your appointment slot...",
            success: (booking) => {
                onOpenChange(false);
                setDate(undefined);
                setSelectedTime(null);

                return {
                    message: "Booked successfully 🎉",
                    description: "Your appointment has been confirmed.",
                    action: {
                        label: "View",
                        onClick: () => router.push(`/customer/bookings?new=${booking.id}`),
                    },
                };
            },
            error: (err) => messageFromAxiosError(err) || "Failed to secure booking.",
        });
    }

    const formattedSelectedDate = date ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : null;

    function isPastDate(d: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d < today;
    }

    function handleOpenChange(isOpen: boolean) {
        onOpenChange(isOpen);

        if (!isOpen) {
            setDate(undefined);
            setSelectedTime(null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
                <div className="relative px-4 pt-4">
                    <DialogHeader className="flex flex-col items-start gap-4 space-y-0 sm:flex-row sm:items-end">
                        <div className="flex flex-1 items-center gap-2">
                            {service?.thumbnail && (
                                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl shadow-xs">
                                    <Image src={service.thumbnail} alt={service.name} fill className="object-cover" sizes="64px" />
                                </div>
                            )}

                            <div className="flex-1">
                                <span className="text-primary mb-0.5 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
                                    <Sparkles className="fill-primary/10 size-3" /> Secure Appointment
                                </span>

                                <DialogTitle className="max-w-9/12 truncate text-lg font-bold tracking-tight sm:max-w-full">{service?.name}</DialogTitle>

                                <DialogDescription className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                                    <span className="flex items-center gap-1 font-medium">
                                        <Clock className="size-3" />
                                        <span className="text-foreground">{service?.durationInMinutes} mins</span>
                                    </span>
                                    {service?.category && (
                                        <>
                                            <span className="text-muted-foreground">•</span>
                                            <span className="text-foreground">{service.category}</span>
                                        </>
                                    )}
                                </DialogDescription>
                            </div>
                        </div>

                        <span className="text-lg font-extrabold tracking-tight">${service?.price.toFixed(2)}</span>
                    </DialogHeader>
                </div>

                <div className="space-y-4 p-5">
                    <div className="space-y-2">
                        <Label className="text-xs">1. Select Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full justify-start gap-2 rounded-xl text-left text-xs font-normal shadow-2xs transition-all", date && "border-primary/40 ring-primary/10 bg-primary/1 ring-1")}>
                                    <CalendarIcon className="text-muted-foreground size-3.5 stroke-[1.5]" />
                                    {formattedSelectedDate ? <span className="font-medium">{formattedSelectedDate}</span> : <span className="text-muted-foreground">Choose an available date...</span>}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto overflow-hidden rounded-xl p-0 shadow-xl" align="start" side="left">
                                <Calendar mode="single" selected={date} onSelect={handleDateSelect} disabled={isPastDate} className="p-3 text-sm" />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className={cn("space-y-2 transition-all duration-300", !date && "pointer-events-none opacity-40 select-none")}>
                        <Label className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                                <span>2. Select Start Time</span>
                            </div>
                            {date && (
                                <span className="flex items-center gap-2">
                                    <span className={cn(isOpenDay ? "bg-emerald-500/10 text-emerald-500" : "text-destructive bg-destructive/10", "rounded-sm px-1.5 py-0.5 text-[10px] font-medium")}>{isOpenDay ? "Open" : "Closed"}</span>
                                </span>
                            )}
                        </Label>

                        <div className="scrollbar-thumb-foreground/20 scrollbar-track-background max-h-40 scrollbar-thin overflow-y-auto rounded-xl border p-2 pr-1">
                            {!date ? (
                                <div className="flex h-20 flex-col items-center justify-center text-center">
                                    <p className="text-muted-foreground text-xs font-medium">Select a date.</p>
                                </div>
                            ) : isOpenDay && availableTimeSlots.length > 0 ? (
                                <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-2">
                                    {availableTimeSlots.map((slot) => {
                                        const isSelected = selectedTime === slot;
                                        return (
                                            <button key={slot} type="button" onClick={() => setSelectedTime(slot)} className={cn("h-8 rounded-lg border text-xs font-medium shadow-2xs outline-hidden transition-all", isSelected ? "bg-foreground text-background font-bold" : "text-muted-foreground")}>
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex h-20 flex-col items-center justify-center text-center">
                                    <p className="text-muted-foreground text-xs font-medium">{isOpenDay ? "No available slots for this date." : "Shop is completely closed on this day."}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-5 py-3">
                    <DialogClose asChild>
                        <Button variant="ghost" size={"lg"} className="rounded-xl px-4 text-xs font-semibold">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleBook} disabled={!date || !selectedTime || isPending} size={"lg"} className="min-w-32 gap-2 rounded-xl px-5 text-xs font-bold shadow-xs transition-all">
                        {isPending ? (
                            <>
                                <Loader2 className="size-3.5 animate-spin" />
                                <span>Securing...</span>
                            </>
                        ) : (
                            <span>Confirm Booking</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
