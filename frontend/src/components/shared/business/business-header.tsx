import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FullBusiness } from "@/types/models";
import { CalendarCheck, MapPin, Phone, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BusinessHeaderProps {
    showSettings: boolean;
    business: FullBusiness;
}

export default function BusinessHeader({ business, showSettings: show }: BusinessHeaderProps) {
    return (
        <>
            <div className="group relative min-h-[40vh] w-full overflow-hidden rounded-3xl bg-zinc-900">
                {business.bannerImages[0] ? (
                    <Image src={business.bannerImages[0]} alt={business.name} fill className="object-cover object-center brightness-50 transition-[transform_brightness] duration-500 group-hover:scale-105 group-hover:brightness-100" priority />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                )}

                <div className="text-background absolute inset-0 flex items-center justify-center p-6 md:p-16">
                    <div className="container mx-auto">
                        <Badge className="bg-background/20 hover:bg-background/30 mb-2 border-none backdrop-blur-md">Official Storefront</Badge>
                        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">{business.name}</h1>

                        <div className="mt-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-6">
                            {business.location && (
                                <span className="flex items-center gap-2 text-sm font-medium sm:text-base">
                                    <MapPin className="size-4 text-red-500" /> {business.location}
                                </span>
                            )}

                            {business.phone && (
                                <span className="flex items-center gap-2 text-sm font-medium sm:text-base">
                                    <Phone className="size-4 text-emerald-500" /> {business.phone}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {show && business.status !== "Closed" && (
                    <div className="absolute right-6 bottom-6 flex gap-4">
                        <Button asChild variant="secondary" className="bg-background/20 text-background hover:bg-background/40 rounded-full border-none backdrop-blur-md">
                            <Link href={`/business/list/${business.id}/bookings`}>
                                <CalendarCheck className="size-4" />
                                Bookings
                            </Link>
                        </Button>

                        <Button asChild variant="secondary" className="bg-background/20 text-background hover:bg-background/40 rounded-full border-none backdrop-blur-md">
                            <Link href={`/business/list/${business.id}/settings`}>
                                <Settings className="size-4" />
                                Business Settings
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            {business.bannerImages.length > 1 && (
                <div className={cn(business.bannerImages.length === 2 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2", "mt-6 grid h-auto min-h-[20vh] gap-4 sm:h-[30vh]")}>
                    {business.bannerImages.slice(1, 3).map((img, idx) => (
                        <div key={idx} className="group relative min-h-50 overflow-hidden rounded-2xl sm:min-h-full">
                            <Image src={img} fill alt="Business interior" className="object-cover brightness-75 transition-[transform_brightness] duration-500 group-hover:scale-105 group-hover:brightness-100" />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
