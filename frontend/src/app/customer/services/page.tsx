"use client"
import { Sparkles } from "lucide-react";

export default function ServicesPage() {
    return (
        <div className="space-y-6">
            <div className="max-w-xl">
                <div className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                    <Sparkles size={16} className="fill-yellow-500 text-yellow-500" />
                    <span>Premium Experiences</span>
                </div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Professional Services</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Find and book the perfect service. From hair and beauty to specialized consultations, our experts are ready to serve you.</p>
                </div>
            </div>
        </div>
    );
}
