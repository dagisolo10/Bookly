"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BookingStatus, BookingStatusCounts } from "@/types/models";
import { CalendarCheck, CalendarX, Clock, Loader2, Sparkles } from "lucide-react";

interface AnalyticsCardsProps {
    counts: BookingStatusCounts;
    isPending: boolean;
}

const cards: {
    label: string;
    key: BookingStatus | "All";
    icon: React.ReactNode;
    color: string;
}[] = [
    { label: "Total Bookings", key: "All", icon: <CalendarCheck className="size-4" />, color: "text-blue-600 bg-blue-500/10" },
    { label: "Pending", key: "Pending", icon: <Clock className="size-4" />, color: "text-amber-600 bg-amber-500/10" },
    { label: "Confirmed", key: "Confirmed", icon: <Sparkles className="size-4" />, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Completed", key: "Completed", icon: <CalendarCheck className="size-4" />, color: "text-blue-600 bg-blue-500/10" },
    { label: "Cancelled", key: "Cancelled", icon: <CalendarX className="size-4" />, color: "text-destructive bg-destructive/10" },
];

export default function AnalyticsCards({ counts, isPending }: AnalyticsCardsProps) {
    const items = cards.map((card) => ({
        ...card,
        count: counts[card.key],
    }));

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((c) => (
                <Card key={c.key} size="sm" className="shadow-xs">
                    <CardContent className="space-y-2 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-xs font-medium">{c.label}</span>
                            <div className={cn("flex size-7 items-center justify-center rounded-lg", c.color.split(" ").slice(1).join(" "))}>
                                <div className={cn(c.color.split(" ")[0])}>{c.icon}</div>
                            </div>
                        </div>
                        <div className="text-2xl font-bold tracking-tight">{isPending ? <Loader2 className="size-4 animate-spin" /> : c.count}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
