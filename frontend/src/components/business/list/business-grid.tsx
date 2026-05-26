import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FullBusiness } from "@/types/models";
import { Ban, MapPin, Pause, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BusinessGrid({ businesses, linkPath }: { businesses: FullBusiness[]; linkPath: string }) {
    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {businesses.map((business, index) => (
                <Link key={business.id} href={`${linkPath}/${business.id}`} className="group">
                    <Card className="h-full gap-0 border-none bg-transparent p-2 shadow-none transition-all">
                        <CardHeader className="relative aspect-16/10 overflow-hidden rounded-lg bg-zinc-900 p-0">
                            {business.bannerImages[0] ? (
                                <Image priority={index < 4} className="object-cover object-center brightness-50 transition-[transform_brightness] duration-500 group-hover:scale-105 group-hover:brightness-100" src={business.bannerImages[0]} alt={business.name} fill />
                            ) : (
                                <div className="absolute inset-0 grid place-items-center text-gray-300">
                                    <div className="flex flex-col items-center gap-1">
                                        <Store />
                                        <h1 className="text-xl">No Image Preview</h1>
                                    </div>
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="flex items-center justify-between px-1 py-2 text-left">
                            <div>
                                <CardTitle className="group-hover:text-primary mb-1 transition-colors">{business.name}</CardTitle>
                                <div className="text-muted-foreground flex items-center gap-1">
                                    <MapPin className="size-3.5" />
                                    <CardDescription className="line-clamp-1 text-xs">{business.location ?? "No location listed"}</CardDescription>
                                </div>
                            </div>

                            {business.status !== "Active" && (
                                <div className={cn(business.status === "Paused" ? "bg-blue-100 text-blue-500" : "bg-red-100 text-red-500", "flex items-center gap-1 rounded-lg px-2 py-1 text-sm")}>
                                    {business.status === "Paused" ? <Pause className="size-4" /> : <Ban className="size-4" />}
                                    <p>{business.status}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
