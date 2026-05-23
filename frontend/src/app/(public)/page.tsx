import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/feature-card";
import { BarChart3, Calendar, CalendarCheck2, ChevronRight, Search, ShieldCheck, Sparkles, Store } from "lucide-react";

export default function Page() {
    return (
        <div className="space-y-24 pt-12">
            <section className="relative flex flex-col items-center gap-6 overflow-hidden text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm text-zinc-600 shadow-sm backdrop-blur">
                    <Sparkles className="text-primary size-4" />
                    Your all-in-one booking platform
                </div>

                <h1 className="text-5xl leading-tight font-bold tracking-tight md:text-7xl">
                    Book appointments <br />
                    <span className="text-primary">effortlessly</span>
                </h1>

                <p className="text-muted-foreground mx-auto max-w-2xl">
                    Discover and book top-rated services near you, or grow your business with smart scheduling and management tools.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Button size={"cta"} asChild>
                        <Link href="/handler/sign-up">Get started</Link>
                    </Button>

                    <Button asChild size={"cta"} variant={"outline"}>
                        <Link href="/about">Learn more</Link>
                    </Button>
                </div>
            </section>
          
            <section className="mx-auto max-w-6xl space-y-12">
                <div className="space-y-2 text-center">
                    <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500 uppercase">For customers</p>
                    <h2 className="text-4xl font-bold tracking-tight">Find and book services you love</h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">Browse local businesses, check availability, and book in seconds.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <FeatureCard icon={Search} title="Discover" text="Explore a wide range of services from top-rated businesses near you." />
                    <FeatureCard icon={Calendar} title="Book" text="Pick a time that works for you and confirm your appointment instantly." />
                    <FeatureCard icon={CalendarCheck2} title="Manage" text="View, reschedule, or cancel bookings from your personal dashboard." />
                </div>
            </section>
     
            <section className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500 uppercase">For business owners</p>
                        <h2 className="text-4xl font-bold tracking-tight">Grow your business with smart scheduling</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Take control of your bookings, reduce no-shows, and attract more customers.
                        </p>
                    </div>

                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <ShieldCheck className="size-5 text-green-500" /> Automated appointment reminders
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <BarChart3 className="size-5 text-blue-500" /> Real-time analytics and insights
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <Store className="text-primary size-5" /> Customizable business profile
                        </li>
                    </ul>

                    <Button size={"cta"} asChild>
                        <Link href="/handler/sign-up">
                            Start growing
                            <ChevronRight className="size-4" />
                        </Link>
                    </Button>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-2xl border-8 border-zinc-800 bg-zinc-900 shadow-2xl">
                    <div className="flex h-full items-center justify-center">
                        <Store className="size-16 text-zinc-700" />
                    </div>
                </div>
            </section>
    
            <section className="bg-primary text-primary-foreground space-y-6 border py-12 text-center">
                <h2 className="text-4xl font-bold">Ready to get started?</h2>

                <p className="mx-auto max-w-xl text-xl opacity-90">
                    Join thousands of users who are already booking and managing services on Bookly.
                </p>

                <Button size={"cta"} variant={"ctaPrimary"} asChild>
                    <Link href="/handler/sign-up">Create your free account</Link>
                </Button>

                <p className="text-sm opacity-75">No credit card required.</p>
            </section>
        </div>
    );
}
