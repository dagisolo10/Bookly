"use client";

import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useAvailableTimeSlots from "@/hooks/custom/use-available-slots";
import { cn } from "@/lib/utils";
import type { BusinessHour } from "@/types/models";

interface RescheduleBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (startsAt: string) => void;
    isPending: boolean;
    bookedDuration: number;
    hours: BusinessHour[] | undefined;
    description?: string;
}

export default function RescheduleBookingDialog({ open, onOpenChange, onConfirm, isPending, bookedDuration, hours, description }: RescheduleBookingDialogProps) {
    const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
    const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);

    const { isOpenDay, availableTimeSlots } = useAvailableTimeSlots({ date: rescheduleDate, duration: bookedDuration, hours });

    const formattedRescheduleDate = rescheduleDate ? rescheduleDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : null;

    function handleRescheduleDateSelect(d: Date | undefined) {
        setRescheduleDate(d);
        setRescheduleTime(null);
    }

    function isPastDate(d: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d < today;
    }

    function handleConfirm() {
        if (!rescheduleDate || !rescheduleTime) return;

        const [hours, minutes] = rescheduleTime.split(":").map(Number) as [number, number];
        const year = rescheduleDate.getFullYear();
        const month = rescheduleDate.getMonth();
        const day = rescheduleDate.getDate();
        const startsAt = new Date(year, month, day, hours, minutes, 0).toISOString();

        onConfirm(startsAt);
    }

    function handleOpenChange(isOpen: boolean) {
        onOpenChange(isOpen);
        if (!isOpen) {
            setRescheduleDate(undefined);
            setRescheduleTime(null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
                <div className="px-4 pt-4">
                    <DialogHeader className="flex flex-col items-start gap-4 space-y-0">
                        <div className="flex-1">
                            <DialogTitle className="text-lg font-bold tracking-tight">Reschedule Booking</DialogTitle>
                            {description && (
                                <DialogDescription className="text-muted-foreground mt-1 text-xs">{description}</DialogDescription>
                            )}
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
                    <Button type="submit" onClick={handleConfirm} disabled={!rescheduleDate || !rescheduleTime || isPending} size="lg" className="min-w-32 gap-2 rounded-xl px-5 text-xs font-bold shadow-xs transition-all">
                        {isPending ? (
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
    );
}
