import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="mx-auto min-h-screen p-8 px-4 sm:px-12">
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
        </main>
    );
}
