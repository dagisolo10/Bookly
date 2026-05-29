import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FullBusiness } from "@/types/models";
import { Ban, MapPin, Pause, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BusinessGridProps {
    businesses: FullBusiness[];
    linkPath: "/business/list" | "/customer/businesses";
}

export default function BusinessGrid({ businesses, linkPath }: BusinessGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {businesses.map((business, index) => {
                const typeRegex = /\(([^)]+)\)/;
                const matches = business.name.match(typeRegex);
                const industryType = matches ? matches[1] : "Service Provider";
                const cleanName = business.name.replace(typeRegex, "").trim();

                return (
                    <Link key={business.id} href={`${linkPath}/${business.id}`} className="group block">
                        <Card className="h-full gap-0 overflow-hidden rounded-xl border-none bg-transparent p-0 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <CardHeader className="relative aspect-16/10 overflow-hidden bg-zinc-900 p-0">
                                {business.bannerImages[0] ? (
                                    <Image priority={index < 5} className="object-cover object-center brightness-90 transition-all duration-500 group-hover:scale-105 group-hover:brightness-100" src={business.bannerImages[0]} alt={business.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" />
                                ) : (
                                    <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-zinc-800 to-zinc-950 text-zinc-500">
                                        <div className="flex flex-col items-center gap-1">
                                            <Store className="size-6" />
                                            <span className="text-xs font-medium">No Preview Available</span>
                                        </div>
                                    </div>
                                )}

                                {business.location && (
                                    <Badge variant="glass" className="bottom-2 left-2 max-w-[85%] truncate">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="size-3 text-emerald-500" />
                                            <span className="truncate">{business.location}</span>
                                        </div>
                                    </Badge>
                                )}

                                {business.status !== "Active" && (
                                    <div className={cn("absolute top-2 right-2 flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase shadow-xs backdrop-blur-md", business.status === "Paused" ? "border border-amber-500/30 bg-amber-500/20 text-amber-400" : "border border-rose-500/30 bg-rose-500/20 text-rose-400")}>
                                        {business.status === "Paused" ? <Pause className="size-2.5" /> : <Ban className="size-2.5" />}
                                        <span>{business.status}</span>
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="flex flex-col p-3 text-left">
                                <span className="text-muted-foreground mb-1 line-clamp-1 text-[10px] font-bold tracking-wider uppercase">{industryType}</span>
                                <CardTitle className="group-hover:text-primary line-clamp-1 text-base font-semibold tracking-tight text-zinc-900 transition-colors">{cleanName}</CardTitle>

                                <div className="mt-4 flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <span className="relative flex size-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                                        </span>
                                        <span>Open Now</span>
                                    </div>

                                    <span className="text-[11px] font-medium text-zinc-400 transition-colors group-hover:text-zinc-600">View Slots &rarr;</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
