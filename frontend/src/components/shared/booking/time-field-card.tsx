"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface TimeFieldCardProps {
    label: string;
    icon: LucideIcon;
    value: string;
    variant: "emerald" | "amber";
}

export default function TimeFieldCard({ label, icon: Icon, value, variant }: TimeFieldCardProps) {
    return (
        <div className="flex items-center gap-3.5 rounded-xl border p-4">
            <div className={cn("rounded-xl border p-2.5", variant === "emerald" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600" : "border-amber-500/20 bg-amber-500/5 text-amber-600")}>
                <Icon className="size-4 stroke-2" />
            </div>
            <div className="flex-1 overflow-hidden font-semibold">
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase">{label}</p>
                <p className="mt-0.5 text-xs whitespace-pre-wrap">{value}</p>
            </div>
        </div>
    );
}
