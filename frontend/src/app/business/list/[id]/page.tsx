"use client";
import BusinessHeader from "@/components/shared/business/business-header";
import BusinessHours from "@/components/shared/business/business-hour";
import ServiceList from "@/components/shared/service/service-list";
import { BusinessBaseSkeleton, ServiceListSkeleton } from "@/components/shared/skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { getOwnerBusinessQueryOptions, getOwnerBusinessServicesQueryOptions, syncUserQueryOptions } from "@/hooks/tan stack/query-options";
import { useQueries } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useParams } from "next/navigation";

export default function OwnerBusinessPage() {
    const { id } = useParams<{ id: string }>();

    const [userQuery, businessQuery, servicesQuery] = useQueries({
        queries: [syncUserQueryOptions(), getOwnerBusinessQueryOptions(id), getOwnerBusinessServicesQueryOptions(id, 1, 5)],
    });

    const isPending = userQuery.isPending || businessQuery.isPending;
    const hasError = [userQuery, businessQuery, servicesQuery].some((q) => q.isError);

    const user = userQuery.data;
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

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Login</p>
            </div>
        );
    }

    return (
        <div className="screen">
            <BusinessHeader business={business} showSettings={user?.roles.includes("Business")} />

            <div className="py-8">
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.6fr_0.4fr]">
                    {serviceListPending ? <ServiceListSkeleton /> : <ServiceList linkPath="/business/list" businessId={business.id} services={serviceData?.data ?? []} />}

                    <aside className="top-20 order-1 space-y-6 sm:sticky lg:order-2">
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
