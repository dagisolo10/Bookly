import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function Description({ description }: { description: string }) {
    return (
        <Card className="border-none p-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-400">
                    <Info className="size-4" /> Our Story
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description || "This business hasn't shared their story yet, but they're ready to serve you!"}</p>
            </CardContent>
        </Card>
    );
}
