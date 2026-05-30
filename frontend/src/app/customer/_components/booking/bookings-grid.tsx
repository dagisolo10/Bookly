"use client";

import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { formatDate, formatDateTime } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";
import type { FullBooking } from "@/types/models";
import { CalendarDays, Clock, ImageIcon, SearchX } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface BookingsGridProps {
    bookings: FullBooking[];
}

const statusStyles: Record<string, string> = {
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Cancelled: "bg-destructive/10 text-destructive",
    Completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export function BookingsGrid({ bookings }: BookingsGridProps) {
    const searchparams = useSearchParams();
    const newBookingId = searchparams.get("new");

    if (bookings.length === 0) {
        return (
            <Empty className="border">
                <EmptyMedia variant="icon">
                    <SearchX className="size-5" />
                </EmptyMedia>
                <EmptyHeader>
                    <EmptyTitle>No bookings found</EmptyTitle>
                    <EmptyDescription>You haven&apos;t made any bookings yet. Browse services to book an appointment.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {bookings.map((booking) => (
                <div key={booking.id} className={cn("group relative flex flex-col items-stretch gap-4 overflow-hidden rounded-xl sm:flex-row", "text-card-foreground p-3 shadow-sm transition-all duration-300 hover:shadow-md")}>
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:w-28">
                        {booking.bookedThumbnail ? (
                            <Image src={booking.bookedThumbnail} alt={booking.bookedServiceName} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 112px" />
                        ) : (
                            <div className="flex size-full items-center justify-center text-zinc-400 dark:text-zinc-600">
                                <ImageIcon className="size-6 stroke-[1.5]" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-0.5">
                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">{booking.bookedCategory}</span>
                                <div className="flex items-center gap-2">
                                    {booking.id === newBookingId && <Badge className="bg-primary/10 text-primary text-[10px]">New</Badge>}
                                    <Badge variant="outline" className={cn("text-[10px] font-semibold tracking-wide uppercase", statusStyles[booking.status] ?? "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400")}>
                                        {booking.status}
                                    </Badge>
                                </div>
                            </div>

                            <h3 className="group-hover:text-primary line-clamp-1 text-base font-semibold tracking-tight transition-colors">{booking.bookedServiceName}</h3>

                            <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                                <CalendarDays className="size-3 stroke-[1.5]" />
                                <span>
                                    {formatDateTime(booking.startsAt)} - {new Date(booking.endsAt).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold">${booking.bookedPrice.toFixed(2)}</span>
                                <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                                    <Clock className="size-3 stroke-[1.75]" />
                                    <span>{booking.bookedDuration}m</span>
                                </div>
                            </div>

                            <span className="text-muted-foreground text-[10px]">Booked {formatDate(booking.createdAt)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
