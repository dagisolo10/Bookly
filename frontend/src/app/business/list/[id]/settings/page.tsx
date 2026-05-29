"use client";
import BusinessSettings from "@/app/business/_components/business/business-settings";
import ErrorScreen from "@/components/shared/error-screen";
import NotFound from "@/components/shared/not-found";
import { BusinessBaseSkeleton } from "@/components/shared/skeletons";
import { getOwnerBusinessQueryOptions, syncUserQueryOptions } from "@/hooks/tan stack/query-options";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SettingsPage() {
    const { id } = useParams<{ id: string }>();

    const [userQuery, businessQuery] = useQueries({ queries: [syncUserQueryOptions(), getOwnerBusinessQueryOptions(id)] });

    const isPending = userQuery.isPending || businessQuery.isPending;
    const hasError = [userQuery, businessQuery].some((q) => q.isError);

    const user = userQuery.data;
    const business = businessQuery.data;

    if (isPending) {
        return <BusinessBaseSkeleton />;
    }

    if (hasError) {
        return <ErrorScreen message="Failed to load business data. Please try again." />;
    }

    if (!business) {
        return <NotFound message="Business not found" />;
    }

    if (!user) {
        return <NotFound message="Please sign in to continue." />;
    }

    return <BusinessSettings initialData={business} />;
}
