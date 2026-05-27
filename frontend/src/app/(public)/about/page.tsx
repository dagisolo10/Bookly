import FeatureCard from "@/components/shared/feature-card";
import { CalendarCheck2, Store, Users } from "lucide-react";

export default function About() {
    return (
        <div className="mx-auto max-w-6xl space-y-8 py-12">
            <div className="max-w-3xl space-y-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500 uppercase">
                    About <span className="text-primary">Bookly</span>
                </p>

                <h1 className="text-5xl font-bold tracking-tight">Booking software built for real service businesses.</h1>

                <p className="text-base leading-7 text-zinc-600">Bookly helps customers discover local experts and gives business owners a clean workflow for accepting, rejecting, and managing requests without losing control of their calendar.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <FeatureCard icon={Users} title="For customers" text="Browse businesses, pick services, and track approvals in one simple flow." />
                <FeatureCard icon={Store} title="For owners" text="Manually review every booking request and keep your schedule intentional." />
                <FeatureCard icon={CalendarCheck2} title="For teams" text="Notification-ready booking events make future socket updates easy to plug in." />
            </div>
        </div>
    );
}
