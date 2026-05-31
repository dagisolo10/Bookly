"use client";

import { Clock, ImageIcon, Tag } from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDuration } from "@/lib/helpers/formatters";

interface ServiceDetailCardProps {
    thumbnail: string | null;
    category: string;
    name: string;
    duration: number;
    price: number;
}

export default function ServiceDetailCard({ thumbnail, category, name, duration, price }: ServiceDetailCardProps) {
    return (
        <Card className="gap-4 overflow-hidden">
            <CardHeader>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
                    {thumbnail ? (
                        <Image src={thumbnail} alt={name} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="360px" priority />
                    ) : (
                        <div className="flex size-full items-center justify-center">
                            <ImageIcon className="text-muted-foreground size-8" />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase">
                        <Tag className="size-2.5" /> {category}
                    </span>
                    <h3 className="text-base font-bold">{name}</h3>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Service Duration</span>
                        <span className="flex items-center gap-1 font-semibold">
                            <Clock className="text-muted-foreground size-3" /> {formatDuration(duration)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Price</span>
                        <span className="text-sm font-bold">${price.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
