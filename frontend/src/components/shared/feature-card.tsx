import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

export default function FeatureCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
    return (
        <Card className="gap-4 p-8 text-left transition-shadow duration-500 hover:shadow-xl">
            <div className="bg-primary/10 text-primary inline-flex size-14 items-center justify-center rounded-2xl">
                <Icon />
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground text-sm">{text}</p>
            </div>
        </Card>
    );
}
