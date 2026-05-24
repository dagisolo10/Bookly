import { Button } from "./ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";

import { Layers, LucideIcon, Plus } from "lucide-react";

interface EmptyProps {
    title: string;
    button: string;
    icon?: LucideIcon;
    description: string;
    onClick: () => void;
}

export default function EmptyState({ button, title, icon: Icon, description, onClick }: EmptyProps) {
    return (
        <Empty className="border">
            <EmptyMedia>
                <Layers className="size-8" />
            </EmptyMedia>

            <EmptyHeader>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>

            <Button onClick={onClick}>
                {Icon ? <Icon className="size-4" /> : <Plus className="size-4" />}
                {button}
            </Button>
        </Empty>
    );
}
