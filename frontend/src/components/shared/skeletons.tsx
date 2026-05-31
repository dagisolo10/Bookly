import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BusinessBaseSkeleton() {
    return (
        <div className="screen">
            <div className="relative min-h-[40vh] w-full overflow-hidden rounded-3xl bg-zinc-900">
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-16">
                    <div className="container mx-auto space-y-4">
                        <Skeleton className="h-5 w-32 rounded-full bg-white/20" />
                        <Skeleton className="h-12 w-72 sm:h-14 sm:w-96" />
                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                            <Skeleton className="h-5 w-48 bg-white/20" />
                            <Skeleton className="h-5 w-40 bg-white/20" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-6 right-6">
                    <Skeleton className="h-10 w-44 rounded-full bg-white/20" />
                </div>
            </div>

            <div className="mt-6 grid h-auto min-h-[20vh] gap-4 sm:h-[30vh] sm:grid-cols-2">
                <Skeleton className="min-h-50 rounded-2xl sm:min-h-full" />
                <Skeleton className="min-h-50 rounded-2xl sm:min-h-full" />
            </div>

            <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-6 rounded" />
                            <Skeleton className="h-8 w-56" />
                        </div>
                        <Skeleton className="h-10 w-36 rounded-full" />
                    </div>

                    <div className="flex gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
                        ))}
                    </div>

                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border-none shadow-sm">
                        <div className="space-y-4 p-6">
                            <Skeleton className="h-6 w-40" />
                            {Array.from({ length: 7 }).map((_, i) => (
                                <Skeleton key={i} className="h-5 w-full" />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border-none shadow-sm">
                        <div className="space-y-3 p-6">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BusinessListSkeleton() {
    return (
        <div>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-56" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-44 rounded-full" />
            </div>

            <div className="space-y-8">
                <div className="bg-card mx-auto flex h-14 max-w-2xl items-center justify-between gap-2 rounded-full border px-4 py-1 shadow-lg ring-1 ring-black/5 sm:sticky sm:top-20">
                    <div className="flex flex-1 items-center gap-3 px-2">
                        <Skeleton className="size-5 rounded-full" />
                        <Skeleton className="h-4 flex-1" />
                    </div>
                    <div className="hidden h-6 w-px bg-zinc-200 md:block" />
                    <Skeleton className="hidden h-9 w-44 rounded-full md:block" />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-900">
                                <Skeleton className="size-full" />
                                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 backdrop-blur-sm">
                                    <Skeleton className="size-3 rounded-full" />
                                    <Skeleton className="h-3 w-6" />
                                </div>
                            </div>
                            <div className="space-y-2 px-1">
                                <Skeleton className="h-5 w-3/4" />
                                <div className="flex items-center gap-1">
                                    <Skeleton className="size-4 shrink-0 rounded-full" />
                                    <Skeleton className="h-4 flex-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border-t pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-9 w-20 rounded-full" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-20 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-9 w-20 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ServiceListSkeleton() {
    return (
        <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-6 rounded" />
                    <Skeleton className="h-8 w-56" />
                </div>
                <Skeleton className="h-10 w-36 rounded-full" />
            </div>

            <div className="bg-background/50 top-16 z-50 py-4 backdrop-blur-lg sm:sticky">
                <div className="flex gap-2 overflow-x-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
                    ))}
                </div>
            </div>

            {Array.from({ length: 2 }).map((_, groupIdx) => (
                <div key={groupIdx} className="space-y-2">
                    <Skeleton className="h-7 w-40" />
                    <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, cardIdx) => (
                            <Skeleton key={cardIdx} className="h-24 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ServiceCardSkeleton() {
    return (
        <div className="bg-card ring-foreground/10 flex animate-pulse flex-col overflow-hidden rounded-xl shadow-xs ring-1 sm:flex-row">
            <div className="bg-muted aspect-3/2 w-full sm:aspect-square sm:w-44" />
            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="space-y-2">
                    <div className="bg-muted h-5 w-3/4 rounded-md" />
                    <div className="flex gap-2">
                        <div className="bg-muted h-4 w-20 rounded-full" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-muted h-4 w-16 rounded-md" />
                    <div className="bg-muted h-3 w-px" />
                    <div className="bg-muted h-4 w-14 rounded-md" />
                </div>
                <div className="mt-auto pt-1">
                    <div className="bg-muted h-8 w-28 rounded-md" />
                </div>
            </div>
        </div>
    );
}

export function ServicesGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function BookingCardSkeleton() {
    return (
        <div className="bg-card ring-foreground/10 flex animate-pulse flex-col overflow-hidden rounded-xl shadow-xs ring-1 sm:flex-row">
            <div className="bg-muted aspect-3/2 w-full sm:aspect-square sm:w-28" />
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="bg-muted h-3 w-16 rounded-full" />
                        <div className="bg-muted h-4 w-14 rounded-full" />
                    </div>
                    <div className="bg-muted h-5 w-3/4 rounded-md" />
                    <div className="bg-muted h-3 w-48 rounded-md" />
                </div>
                <div className="mt-auto flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <div className="bg-muted h-5 w-14 rounded-md" />
                        <div className="bg-muted h-3 w-1" />
                        <div className="bg-muted h-3 w-10 rounded-md" />
                    </div>
                    <div className="bg-muted h-3 w-20 rounded-md" />
                </div>
            </div>
        </div>
    );
}

export function BookingsGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: count }).map((_, i) => (
                <BookingCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function ServicesTableSkeleton() {
    return (
        <div className="screen space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-full" />
            </div>

            <Skeleton className="h-10 max-w-sm rounded-xl" />

            <div className="rounded-xl border">
                <div className="flex items-center gap-4 border-b px-4 py-3">
                    {["Name", "Category", "Duration", "Price", "Status", "Created", "Actions"].map((_, i) => (
                        <Skeleton key={i} className={`h-4 ${i === 6 ? "ml-auto w-16" : i === 0 ? "w-32 flex-1" : "w-24 flex-1"}`} />
                    ))}
                </div>

                {Array.from({ length: 8 }).map((_, rowIdx) => (
                    <div key={rowIdx} className="flex items-center gap-4 border-b px-4 py-4 last:border-b-0">
                        {Array.from({ length: 7 }).map((_, colIdx) => (
                            <Skeleton key={colIdx} className={`h-5 ${colIdx === 6 ? "ml-auto w-8" : colIdx === 0 ? "w-32 flex-1" : "w-24 flex-1"}`} />
                        ))}
                    </div>
                ))}

                <div className="flex items-center justify-between border-t px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16 rounded" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20 rounded" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-8 w-20 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BookingDetailSkeleton() {
    return (
        <div className="screen space-y-6">
            <Skeleton className="h-8 w-36 rounded-xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="space-y-6 p-8">
                            <div className="space-y-4">
                                <Skeleton className="h-5 w-48" />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Skeleton className="h-16 rounded-xl" />
                                    <Skeleton className="h-16 rounded-xl" />
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <Skeleton className="h-5 w-40" />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Skeleton className="h-16 rounded-xl" />
                                    <Skeleton className="h-16 rounded-xl" />
                                </div>
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-8">
                            <Skeleton className="h-5 w-36" />
                            <div className="mt-6 space-y-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="gap-4 overflow-hidden">
                        <CardHeader>
                            <Skeleton className="aspect-video w-full rounded-xl" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-48" />
                            <Separator />
                            <div className="space-y-2.5">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export function OwnerBookingDetailSkeleton() {
    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
            <Skeleton className="h-8 w-36 rounded-xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="space-y-6 p-6">
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                        </CardContent>
                    </Card>
                </div>

                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
    );
}
