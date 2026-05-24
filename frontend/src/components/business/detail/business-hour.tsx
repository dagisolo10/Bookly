import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import getTimezoneOffset from "@/lib/helpers/timezone-converter";
import { BusinessHour } from "@/types/models";
import { Clock, Globe } from "lucide-react";

export default function BusinessHours({ hours, timezone }: { hours: BusinessHour[]; timezone: string }) {
    const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

    const hoursByDay = new Map(hours.map((h) => [h.day, h] as const));
    const sortedHours = dayOrder.map((day) => [day, hoursByDay.get(day)] as const);

    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(now);

    const offset = getTimezoneOffset(timezone);

    const currentDay = parts.find((p) => p.type === "weekday")?.value ?? dayOrder[now.getDay()];
    const currentHour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
    const currentMinute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    const toMinutes = (time: string) => {
        const [h, m] = time.split(":");
        return Number(h) * 60 + Number(m);
    };

    const todayHours = hours.find((h) => h.day === currentDay);
    const isOpen = !!todayHours && currentTotalMinutes >= toMinutes(todayHours.open) && currentTotalMinutes <= toMinutes(todayHours.close);

    return (
        <Card className="border-none shadow-sm">
            <CardContent className="space-y-4 p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-xl font-bold">
                        <Clock size={20} /> Business Hours
                    </h3>
                    {isOpen ? (
                        <div className="flex animate-pulse items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                            <span className="size-1.5 rounded-full bg-emerald-600" />
                            OPEN NOW
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-400">
                            <span className="size-1.5 rounded-full bg-red-600" />
                            Closed
                        </div>
                    )}
                </div>

                <div className="space-y-2 text-sm">
                    {sortedHours.map(([day, time]) => {
                        const isToday = day === currentDay;

                        return (
                            <div
                                key={day}
                                className={`flex justify-between border-b pb-1.5 capitalize last:border-b-0 ${isToday ? "font-bold text-zinc-950" : "font-medium text-zinc-600"}`}
                            >
                                <span>
                                    {day} {isToday && " (Today)"}
                                </span>
                                <span className="text-right">
                                    {time ? (
                                        `${time.open} - ${time.close}`
                                    ) : (
                                        <Badge variant="secondary" className="font-normal">
                                            Closed
                                        </Badge>
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    <div className="flex items-center gap-1">
                        <Globe size={12} />
                        <span className="max-w-37.5 truncate">{timezone.replace(/_/g, " ")}</span>
                    </div>
                    <span>{offset}</span>
                </div>
            </CardContent>
        </Card>
    );
}
