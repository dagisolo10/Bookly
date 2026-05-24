"use client";
import Description from "@/components/business/detail/business-description";
import BusinessHeader from "@/components/business/detail/business-header";
import BusinessHours from "@/components/business/detail/business-hour";
import ServiceList from "@/components/business/services/service-list";
import { getOwnerBusinessByIdQueryOptions, getOwnerBusinessServicesQueryOptions, syncUserQueryOptions } from "@/hooks/tan stack/query-options";
import { cn } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BusinessPage() {
    const { id } = useParams<{ id: string }>();

    const [userQuery, businessQuery, servicesQuery] = useQueries({
        queries: [syncUserQueryOptions(), getOwnerBusinessByIdQueryOptions(id), getOwnerBusinessServicesQueryOptions(id, 1, 5)],
    });

    const isPending = [userQuery, businessQuery, servicesQuery].some((q) => q.isPending);
    const hasError = [userQuery, businessQuery, servicesQuery].some((q) => q.isError);

    const user = userQuery.data;
    const business = businessQuery.data;
    const serviceData = servicesQuery.data;

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Failed to load business data. Please try again.</p>
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
                    <ServiceList businessId={business.id} services={serviceData?.data ?? []} />

                    <aside className="top-20 order-1 space-y-6 sm:sticky lg:order-2">
                        <BusinessHours timezone={business.timeZone} hours={business.hours} />
                        <Description description={business.description ?? "No Description"} />
                    </aside>
                </div>
            </div>
        </div>
    );
}
