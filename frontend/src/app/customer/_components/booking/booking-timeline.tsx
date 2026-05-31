"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BookingTimelineProps {
    status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
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

export default function BookingTimeline({ status }: BookingTimelineProps) {
    return (
        <Card className="p-0">
            <CardContent className="p-8">
                <h2 className="text-sm font-semibold">Booking Timeline</h2>
                <div className="mt-6 space-y-0">
                    <TimelineStep icon={CheckCircle2} label="Booking Created" completed isLast={status === "Pending"} />
                    {status === "Pending" && <TimelineStep icon={Clock} label="Awaiting Confirmation" completed={false} isLast />}
                    {status === "Confirmed" && <TimelineStep icon={CheckCircle2} label="Booking Confirmed" completed isLast />}
                    {status === "Cancelled" && <TimelineStep icon={XCircle} label="Booking Cancelled" completed cancelled isLast />}
                    {status === "Completed" && (
                        <>
                            <TimelineStep icon={CheckCircle2} label="Booking Confirmed" completed />
                            <TimelineStep icon={CheckCircle2} label="Booking Completed" completed isLast />
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
