"use client";
import MyServiceList from "@/components/business/my-services-list";

import BusinessHeader from "@/components/business/business-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getOwnerBusinessByIdQueryOptions, getOwnerBusinessServicesQueryOptions, syncUserQueryOptions } from "@/hooks/query-options";
import getTimezoneOffset from "@/lib/helpers/timezone-converter";
import { cn } from "@/lib/utils";
import { BusinessHour } from "@/types/models";
import { useQueries } from "@tanstack/react-query";
import { Clock, Globe, Info } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BusinessPage() {
    const { id } = useParams<{ id: string }>();

    const queries = useQueries({
        queries: [syncUserQueryOptions(), getOwnerBusinessByIdQueryOptions(id), getOwnerBusinessServicesQueryOptions(id)],
    });

    const user = queries[0]?.data;
    const business = queries[1]?.data;
    const services = queries[2]?.data;

    const isPending = queries.some((q) => q.isPending);

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Business not found</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Login</p>
            </div>
        );
    }

    return (
        <div>
            <BusinessHeader business={business} show={user?.roles.includes("Business")} />

            {business.bannerImages.length > 1 && (
                <div
                    className={cn(
                        business.bannerImages.length === 2 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
                        "mt-6 grid h-auto min-h-[20vh] gap-4 sm:h-[30vh]",
                    )}
                >
                    {business.bannerImages.slice(1, 3).map((img, idx) => (
                        <div key={idx} className="group relative min-h-50 overflow-hidden rounded-2xl sm:min-h-full">
                            <Image
                                src={img}
                                fill
                                alt="Business interior"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                        </div>
                    ))}
                </div>
            )}

            <div className="py-8">
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                    <MyServiceList businessId={business.id} services={services || []} />

                    <aside className="top-20 order-1 space-y-6 sm:sticky lg:order-2">
                        <BusinessHours timezone={business.timeZone} hours={business.hours} />
                        <Description description={business.description ?? "No Description"} />
                    </aside>
                </div>
            </div>
        </div>
    );
}

function BusinessHours({ hours, timezone }: { hours: BusinessHour[]; timezone: string }) {
    const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const sortedHours = Object.entries(hours || {}).sort(([a], [b]) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    const now = new Date();
    const currentDay = dayOrder[now.getDay()];
    const offset = getTimezoneOffset(timezone);

    const currentTime = now.toLocaleTimeString(undefined, { timeZone: timezone, hour12: false, hour: "2-digit", minute: "2-digit" });
    const todayHours = hours.find((h) => h.day === currentDay);
    const isOpen = todayHours && currentTime >= todayHours.open && currentTime <= todayHours.close;

    return (
        <Card className="border-none shadow-sm">
            <CardContent className="space-y-4 p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                    {/* {business.status === "Closed" && <h1></h1>} */}
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

function Description({ description }: { description: string }) {
    return (
        <Card className="border-none shadow-sm">
            <CardContent className="p-6">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-zinc-400">
                    <Info className="size-4" /> Our Story
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {description || "This business hasn't shared their story yet, but they're ready to serve you!"}
                </p>
            </CardContent>
        </Card>
    );
}
