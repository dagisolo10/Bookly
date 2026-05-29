"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { formatDuration } from "@/lib/helpers/formatters";
import { cn } from "@/lib/utils";
import { FullService } from "@/types/models";
import { CalendarDays, Clock, ImageIcon, SearchX } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import BookingSheet from "../booking/booking-sheet";

interface ServicesGridProps {
    services: FullService[];
    businessName?: string;
}

export function ServicesGrid({ services, businessName }: ServicesGridProps) {
    const [selectedService, setSelectedService] = useState<FullService | null>(null);

    if (services.length === 0) {
        return (
            <Empty className="border">
                <EmptyMedia variant="icon">
                    <SearchX className="size-5" />
                </EmptyMedia>
                <EmptyHeader>
                    <EmptyTitle>No services available</EmptyTitle>
                    <EmptyDescription>This business hasn&apos;t added any services yet. Check back later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {services.map((service) => (
                <div key={service.id} className={cn("group relative flex flex-col items-stretch gap-4 overflow-hidden rounded-xl sm:flex-row", "text-card-foreground p-3 shadow-sm transition-all duration-300 hover:shadow-md")}>
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:w-28">
                        {service.thumbnail ? (
                            <Image src={service.thumbnail} alt={service.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 112px" />
                        ) : (
                            <div className="flex size-full items-center justify-center text-zinc-400 dark:text-zinc-600">
                                <ImageIcon className="size-6 stroke-[1.5]" />
                            </div>
                        )}

                        <Badge variant="glass" className="top-2 left-2 block sm:hidden">
                            {service.category}
                        </Badge>
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-0.5">
                        <div>
                            <div className="hidden items-center gap-2 sm:flex">
                                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">{service.category}</span>
                                {businessName && (
                                    <>
                                        <span className="size-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        <span className="text-muted-foreground max-w-[150px] truncate text-[11px] font-medium">{businessName}</span>
                                    </>
                                )}
                            </div>

                            <h3 className="group-hover:text-primary line-clamp-1 text-base font-semibold tracking-tight transition-colors">{service.name}</h3>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs sm:hidden">{businessName && <span className="max-w-[180px] truncate font-medium">{businessName}</span>}</div>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold">${service.price.toFixed(2)}</span>
                            <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                                <Clock className="size-3 stroke-[1.75]" />
                                <span>{formatDuration(service.durationInMinutes)}</span>
                            </div>
                        </div>

                        <Button onClick={() => setSelectedService(service)} size="sm" className={cn("gap-1.5 self-end rounded-lg px-3.5 text-xs font-medium shadow-xs transition-all", "bg-zinc-900 text-zinc-50 hover:bg-zinc-800", "dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200")}>
                            <CalendarDays className="size-3.25" />
                            <span>Book Slot</span>
                        </Button>
                    </div>
                </div>
            ))}

            <BookingSheet open={!!selectedService} service={selectedService} onOpenChange={() => setSelectedService(null)} />
        </div>
    );
}
