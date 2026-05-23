import FeatureCard from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, Dumbbell, Flower2, Heart, LucideIcon, Scissors, Search, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Customer() {
    return (
        <main className="space-y-24">
            <section className="space-y-6 text-center">
                <div className="text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs shadow-sm backdrop-blur sm:text-sm">
                    <Sparkles className="size-4 text-yellow-500" />
                    <span>Over 2,500+ local experts joined this month</span>
                </div>

                <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                    Book trusted local <span className="text-primary">services</span> in seconds.
                </h1>

                <p className="text-muted-foreground mx-auto max-w-2xl">
                    Discover salons, spas, gyms, and wellness experts near you. Book instantly, no phone calls required.
                </p>
            </section>

            <section className="space-y-8">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl">How it works</h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">Finding and booking your next appointment has never been easier.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <FeatureCard
                        icon={Search}
                        title="1. Find a Service"
                        text="Browse trusted local businesses or search for the exact service you need."
                    />
                    <FeatureCard
                        icon={Calendar}
                        title="2. Pick a Time"
                        text="View real-time availability and choose a slot that fits your schedule."
                    />
                    <FeatureCard icon={Heart} title="3. Book & Relax" text="Confirm instantly and show up. No calls, no waiting — just results." />
                </div>
            </section>

            <section className="space-y-6 py-12">
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">Browse by category</h2>
                        <p className="text-muted-foreground">Find exactly what you need for your self-care routine.</p>
                    </div>

                    <Button variant={"ghost"} asChild>
                        <Link href="/customer">View all</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <CategoryCard icon={Scissors} name="Barber Shop" count="120+ Pros" color="bg-blue-50 text-blue-600 border-blue-100" />
                    <CategoryCard icon={Flower2} name="Wellness" count="85+ Studios" color="bg-green-50 text-green-600 border-green-100" />
                    <CategoryCard icon={Sparkles} name="Aesthetics" count="200+ Experts" color="bg-purple-50 text-purple-600 border-purple-100" />
                    <CategoryCard icon={Dumbbell} name="Fitness" count="45+ Gyms" color="bg-orange-50 text-orange-600 border-orange-100" />
                </div>
            </section>
        </main>
    );
}

function CategoryCard({ icon: Icon, name, count, color }: { icon: LucideIcon; name: string; count: string; color: string }) {
    return (
        <Card className="gap-4 p-6 text-left transition-shadow duration-500 hover:shadow-xl">
            <div className={cn(color, "inline-flex size-12 items-center justify-center rounded-2xl")}>
                <Icon />
            </div>

            <div className="space-y-1">
                <h3 className="font-semibold">{name}</h3>
                <p className="text-muted-foreground text-sm">{count}</p>
            </div>
        </Card>
    );
}
