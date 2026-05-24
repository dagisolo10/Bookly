"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToggleService } from "@/hooks/tan stack/use-owner-service";
import { cn } from "@/lib/utils";
import { Service } from "@/types/models";
import { Clock, EyeOff } from "lucide-react";

interface ServiceCardProps {
    service: Service;
    onEdit: (service: Service) => void;
}

export default function ServiceCard({ service, onEdit }: ServiceCardProps) {
    const { mutate: toggleService, isPending: isToggling } = useToggleService();
    const isActive = service.isActive;

    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all duration-200",
                isActive ? "hover:bg-muted/40 hover:shadow-sm" : "bg-muted/30 border-muted-foreground/30 border-dashed",
            )}
        >
            <CardContent className="flex items-center justify-between px-6">
                <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className={cn("font-semibold transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>
                            {service.name}
                        </h3>

                        {!isActive && (
                            <Badge
                                variant="secondary"
                                className="bg-muted text-muted-foreground gap-1 border-none px-1.5 py-0 text-[10px] font-medium tracking-wider uppercase"
                            >
                                <EyeOff className="size-3" />
                                Hidden
                            </Badge>
                        )}
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1">
                            <Clock className="text-muted-foreground/60 size-3.5" />
                            {service.durationInMinutes} min
                        </span>
                        <span>•</span>
                        {service.category ? (
                            <span className="bg-muted/60 rounded text-[11px] font-medium">{service.category}</span>
                        ) : (
                            <span className="text-muted-foreground/40 italic">No category</span>
                        )}
                    </div>

                    <p className={cn("text-sm font-semibold", isActive ? "text-foreground" : "text-muted-foreground/70")}>
                        ${service.price.toFixed(2)}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Button onClick={() => onEdit(service)} variant="ghost" size={"sm"} className="text-xs">
                        Edit
                    </Button>

                    <Button
                        variant={isActive ? "outline" : "default"}
                        disabled={isToggling}
                        onClick={() => toggleService({ serviceId: service.id, businessId: service.businessId })}
                        size="sm"
                        className={cn(
                            "min-w-[84px] gap-1.5 text-xs font-medium",
                            isActive
                                ? "text-destructive hover:bg-destructive/10 hover:text-destructive border-muted"
                                : "bg-primary text-primary-foreground",
                        )}
                    >
                        {isToggling ? <Spinner className="size-3" /> : isActive ? "Deactivate" : "Activate"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
