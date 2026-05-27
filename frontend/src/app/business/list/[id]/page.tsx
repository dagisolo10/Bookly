"use client";
import Description from "@/components/business/detail/business-description";
import BusinessHeader from "@/components/business/detail/business-header";
import BusinessHours from "@/components/business/detail/business-hour";
import ServiceList from "@/components/business/services/service-list";
import { BusinessBaseSkeleton, ServiceListSkeleton } from "@/components/shared/skeletons";
import { getOwnerBusinessQueryOptions, getOwnerBusinessServicesQueryOptions, syncUserQueryOptions } from "@/hooks/tan stack/query-options";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function BusinessPage() {
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
            <BusinessHeader business={business} show={user?.roles.includes("Business")} />

            <div className="py-8">
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                    {serviceListPending ? <ServiceListSkeleton /> : <ServiceList businessId={business.id} services={serviceData?.data ?? []} />}

                    <aside className="top-20 order-1 space-y-6 sm:sticky lg:order-2">
                        <BusinessHours timezone={business.timeZone} hours={business.hours} />
                        <Description description={business.description ?? "No Description"} />
                    </aside>
                </div>
            </div>
        </div>
    );
}
