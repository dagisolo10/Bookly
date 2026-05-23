"use client";
import { Button } from "@//components/ui/button";
import BusinessListLoading from "@/components/business/business-loading";
import BusinessSearch from "@/components/business/business-search";
import { getOwnerBusinessesQueryOptions } from "@/hooks/query-options";
import { useQuery } from "@tanstack/react-query";
import { Plus, Store } from "lucide-react";
import Link from "next/link";

export default function BusinessList() {
    const { data: businesses, isPending, error } = useQuery(getOwnerBusinessesQueryOptions());

    if (isPending) {
        return <BusinessListLoading />;
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-destructive">Error: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">My Businesses</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Manage your storefronts, view ratings, and update service listings.</p>
                </div>

                <Button asChild>
                    <Link href="/business/new">
                        <Plus className="size-4" />
                        Add New Business
                    </Link>
                </Button>
            </div>

            {businesses.length > 0 ? (
                <div>
                    <BusinessSearch businesses={businesses} linkPath="/business/list" placeholder="Search your businesses by name or city..." />
                </div>
            ) : (
                <EmptyBusiness />
            )}
        </div>
    );
}

function EmptyBusiness() {
    return (
        <div className="flex h-96 flex-col items-center justify-center rounded-3xl border-2 border-dashed">
            <Store className="text-muted-foreground mb-4 size-12" />
            <h2 className="text-xl font-semibold">No businesses found</h2>
            <p className="text-muted-foreground">Get started by registering your first business.</p>
        </div>
    );
}
