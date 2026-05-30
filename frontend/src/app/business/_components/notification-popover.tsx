"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Bell, Clock } from "lucide-react";

const dummyNotifications = [
    { id: "1", title: "New booking received", timestamp: "2 min ago", unread: true },
    { id: "2", title: "Service updated", timestamp: "1 hour ago", unread: true },
    { id: "3", title: "Booking cancelled", timestamp: "3 hours ago", unread: false },
    { id: "4", title: "Payment confirmed", timestamp: "1 day ago", unread: false },
];

export default function NotificationPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative size-9 rounded-full">
                    <Bell className="size-4" />
                    <span className="bg-destructive text-background absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full text-[8px] font-bold">2</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <span className="text-sm font-semibold">Notifications</span>
                    <span className="text-muted-foreground text-[10px]">{dummyNotifications.filter((n) => n.unread).length} unread</span>
                </div>
                <Separator />
                <div className="max-h-64 overflow-y-auto py-1">
                    {dummyNotifications.map((n) => (
                        <div key={n.id} className="hover:bg-muted/50 flex items-start gap-3 px-4 py-2.5 transition-colors">
                            <div className={cn(n.unread ? "bg-primary" : "bg-transparent", "mt-1.5 size-2 shrink-0 rounded-full")} />
                            <div className="flex-1 space-y-0.5">
                                <p className={cn(n.unread ? "font-medium" : "text-muted-foreground", "text-xs")}>{n.title}</p>
                                <p className="text-muted-foreground flex items-center gap-1 text-[10px]">
                                    <Clock className="size-2.5" />
                                    {n.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
