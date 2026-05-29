import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessHour } from "@/types/models";
import { Clock } from "lucide-react";

export default function BusinessHours({ hours }: { hours: BusinessHour[] }) {
    const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

    const hoursByDay = new Map(hours.map((h) => [h.day, h] as const));
    const sortedHours = dayOrder.map((day) => [day, hoursByDay.get(day)] as const);

    const now = new Date();
    const currentDay = dayOrder[now.getDay()];
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    const toMinutes = (time: string) => {
        const [h, m] = time.split(":");
        return Number(h) * 60 + Number(m);
    };

    const todayHours = hours.find((h) => h.day === currentDay);
    const isOpen = !!todayHours && currentTotalMinutes >= toMinutes(todayHours.open) && currentTotalMinutes <= toMinutes(todayHours.close);

    return (
        <Card className="border-none shadow-sm">
            <CardContent className="space-y-4 p-5">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-xl font-bold">
                        <Clock size={20} /> Business Hours
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
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
                </div>

                <div className="space-y-2 text-sm">
                    {sortedHours.map(([day, time]) => {
                        const isToday = day === currentDay;
                        const getFullTime = (time: string) => {
                            const [hour, min] = time.split(":");
                            const hourInNumber = Number(hour);
                            const period = hourInNumber > 12 ? "PM" : "AM";
                            return `${(hourInNumber > 12 ? hourInNumber - 12 : hourInNumber).toString().padStart(2, "0")}:${min} ${period}`;
                        };
                        const open = time ? getFullTime(time.open) : "";
                        const close = time ? getFullTime(time.close) : "";

                        return (
                            <div
                                key={day}
                                className={`flex items-center justify-between gap-2 border-b pb-1.5 capitalize last:border-b-0 ${isToday ? "font-bold text-zinc-950" : "font-medium text-zinc-600"}`}
                            >
                                {time ? (
                                    <>
                                        <span className="text-center">
                                            {day} {isToday && <span className="text-muted-foreground text-[11px] font-normal">(Today)</span>}
                                        </span>
                                        <span className="text-right text-xs whitespace-nowrap">
                                            {open} - {close}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span>{day}</span>
                                        <span className="text-right">
                                            <Badge variant="secondary" className="font-semibold">
                                                Closed
                                            </Badge>
                                        </span>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
