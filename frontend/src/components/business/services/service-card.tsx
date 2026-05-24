"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Service } from "@/types/models";

interface ServiceCardProps {
    service: Service;
    onEdit: (service: Service) => void;
}

export default function ServiceCard({ service, onEdit }: ServiceCardProps) {
    return (
        <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="flex items-center justify-between px-6">
                <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-muted-foreground text-xs">{service.durationInMinutes} min</p>
                    <p className="mt-1 text-sm font-semibold">${service.price}</p>
                </div>
                <div className="flex items-center">
                    <Button
                        onClick={() => onEdit(service)}
                        variant="ghost"
                        className="cursor-pointer rounded-full text-xs transition-all"
                    >
                        Edit
                    </Button>
                    <Button variant="ghost" className="cursor-pointer rounded-full text-xs transition-all">
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
