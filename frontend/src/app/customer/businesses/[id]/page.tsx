"use client";
import BusinessHeader from "@/components/shared/business/business-header";
import BusinessHours from "@/components/shared/business/business-hour";
import ServiceList from "@/components/shared/service/service-list";
import { BusinessBaseSkeleton, ServiceListSkeleton } from "@/components/shared/skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { getBusinessQueryOptions, getBusinessServicesQueryOptions } from "@/hooks/tan stack/query-options";
import { useQueries } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useParams } from "next/navigation";

export default function CustomerBusinessPage() {
    const { id } = useParams<{ id: string }>();

    const [businessQuery, servicesQuery] = useQueries({
        queries: [getBusinessQueryOptions(id), getBusinessServicesQueryOptions(id, 1, 5)],
    });

    const isPending = businessQuery.isPending;
    const hasError = [businessQuery, servicesQuery].some((q) => q.isError);

    const business = businessQuery.data;
    const serviceData = servicesQuery.data;

    const serviceListPending = servicesQuery.isPending;

    if (isPending) {
        return <BusinessBaseSkeleton />;
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

    return (
        <div>
            <BusinessHeader business={business} showSettings={false} />

            <div className="py-8">
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.6fr_0.4fr]">
                    {serviceListPending ? <ServiceListSkeleton /> : <ServiceList linkPath="/customer/businesses" businessId={business.id} services={serviceData?.data ?? []} />}

                    <aside className="top-20 order-1 space-y-6 sm:sticky sm:order-2">
                        <BusinessHours hours={business.hours} />
                        <Card className="border-none p-0 shadow-sm">
                            <CardContent className="space-y-4 p-6">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-400">
                                    <Info className="size-4" /> Our Story
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {business.description || "This business hasn't shared their story yet, but they're ready to serve you!"}
                                </p>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    );
}
