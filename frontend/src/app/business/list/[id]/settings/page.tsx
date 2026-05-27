"use client";
import BusinessSettings from "@/components/business/detail/business-settings";
import { BusinessBaseSkeleton } from "@/components/shared/skeletons";
import { getOwnerBusinessQueryOptions, getOwnerBusinessServicesQueryOptions, syncUserQueryOptions } from "@/hooks/tan stack/query-options";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SettingsPage() {
    const { id } = useParams<{ id: string }>();

    const [userQuery, businessQuery, servicesQuery] = useQueries({ queries: [syncUserQueryOptions(), getOwnerBusinessQueryOptions(id), getOwnerBusinessServicesQueryOptions(id, 1, 5)] });

    const isPending = userQuery.isPending || businessQuery.isPending;
    const hasError = [userQuery, businessQuery, servicesQuery].some((q) => q.isError);

    const user = userQuery.data;
    const business = businessQuery.data;

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

    return <BusinessSettings initialData={business} />;
}
