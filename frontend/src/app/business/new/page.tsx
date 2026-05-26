import BusinessForm from "@/components/business/detail/business-form";
import { ArrowLeft, CheckCircle2, Rocket, Store } from "lucide-react";
import Link from "next/link";

export default function CreateBusiness() {
    return (
        <main className="flex flex-col lg:flex-row">
            <section className="relative hidden flex-col justify-between bg-zinc-900 p-12 text-white lg:flex lg:w-2/5">
                <div className="space-y-6">
                    <Link href="/business/list" className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white">
                        <ArrowLeft className="size-4" />
                        <span className="text-sm font-medium">Back to dashboard</span>
                    </Link>

                    <div className="space-y-6">
                        <div className="w-fit rounded-2xl bg-white/10 p-3">
                            <Store className="size-8 text-white" />
                        </div>
                        <h1 className="text-5xl leading-tight font-bold tracking-tighter">
                            Bring your business <br /> to the digital front.
                        </h1>
                        <p className="text-muted-foreground max-w-md">Join thousands of professionals. List your services, manage bookings, and grow your brand in one place.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
                            <CheckCircle2 className="size-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Professional Profile</p>
                            <p className="text-xs text-zinc-500">A dedicated page for your business.</p>
                        </div>
                    </div>
                    <div className="items-c enter flex gap-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
                            <CheckCircle2 className="size-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Smart Scheduling</p>
                            <p className="text-xs text-zinc-500">Automate your client appointments.</p>
                        </div>
                    </div>
                </div>

                <div className="pointer-events-none absolute right-0 bottom-0 h-1/2 w-full bg-linear-to-t from-white/5 to-transparent" />
            </section>

            <section className="flex w-full flex-1 flex-col overflow-y-auto p-6 lg:p-12">
                <header className="space-y-2">
                    <div className="text-primary flex items-center gap-2">
                        <Rocket className="size-6" />
                        <span className="font-bold tracking-tight">Partner Portal</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Register Business</h1>
                        <p className="text-muted-foreground max-w-lg text-sm">Please provide the information below to register your business. You can edit these details later in your settings.</p>
                    </div>
                </header>

                <BusinessForm />
            </section>
        </main>
    );
}
