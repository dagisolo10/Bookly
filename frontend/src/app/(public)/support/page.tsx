import FeatureCard from "@/components/feature-card";
import { Mail, MessageSquareText, ShieldCheck } from "lucide-react";

export default function Support() {
    return (
        <main className="mx-auto max-w-6xl space-y-8 py-12">
            <div className="max-w-3xl space-y-4">
                <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500 uppercase">Support</p>

                <h1 className="text-5xl font-bold tracking-tight">Help for customers, owners, and admins.</h1>

                <p className="text-base leading-7 text-zinc-600">
                    Use this page as the support hub while the product is growing. It explains the booking approval flow and where to look when a
                    request seems stuck.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <FeatureCard
                    icon={MessageSquareText}
                    title="Booking requests"
                    text="New bookings stay pending until the business owner accepts or rejects them."
                />
                <FeatureCard
                    icon={ShieldCheck}
                    title="Reschedules"
                    text="Changing a time creates a fresh approval request so owners can verify availability."
                />
                <FeatureCard
                    icon={Mail}
                    title="Contact path"
                    text="Add your real email, chat, or help desk here when your support workflow is ready."
                />
            </div>
        </main>
    );
}
