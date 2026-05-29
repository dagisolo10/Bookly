import FeatureCard from "@/components/shared/feature-card";
import { Button } from "@/components/ui/button";
import { BarChart3, Globe, LayoutDashboard, Plus, ShieldCheck, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function BusinessLanding() {
    return (
        <div className="screen space-y-24">
            <section className="space-y-6 text-center">
                <div className="text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs shadow-sm backdrop-blur sm:text-sm">
                    <Zap className="size-4 fill-blue-500 text-blue-500" />
                    <span>Empowering 500+ local businesses this month</span>
                </div>

                <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                    Grow your business on <span className="text-primary">autopilot.</span>
                </h1>

                <p className="text-muted-foreground mx-auto max-w-2xl">The all-in-one platform to manage bookings, track revenue, and reach new customers. Stop chasing appointments and start building your brand.</p>

                <div className="flex justify-center gap-4">
                    <Button size={"cta"} asChild>
                        <Link href="/business/list" className="bg-primary hover:bg-primary/70 font-semibold text-white transition-colors">
                            List Your Businesses
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="space-y-8">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl">Everything you need to scale</h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">Powerful tools designed specifically for service-based professionals.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <FeatureCard icon={LayoutDashboard} title="Smart Dashboard" text="Monitor your daily schedule, active bookings, and total completions at a single glance." />
                    <FeatureCard icon={BarChart3} title="Revenue Tracking" text="Detailed analytics on your most popular services and monthly earnings reports." />
                    <FeatureCard icon={Users} title="Customer Management" text="Maintain a digital database of your customers, their history, and verified reviews." />
                </div>
            </section>

            <section className="grid items-center gap-12 md:grid-cols-2">
                <div className="space-y-6">
                    <h2 className="text-4xl leading-tight font-semibold">
                        Your business is open <br /> 24/7—even when you are not.
                    </h2>
                    <p className="text-muted-foreground text-sm">Let your customers book appointments while you sleep. Our automated system handles scheduling, cancellations, and notifications so you can focus on your craft.</p>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <ShieldCheck className="size-5 text-green-500" /> Secure payment processing
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <Globe className="size-5 text-blue-500" /> Custom business landing page
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <Plus className="text-primary size-5" /> Unlimited service listings
                        </li>
                    </ul>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-2xl border-8 border-zinc-800 bg-zinc-900 shadow-2xl">
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500 italic" />
                </div>
            </section>
        </div>
    );
}
