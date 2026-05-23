"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { FullService, Service as ServiceType } from "@/types/models";
import { motion } from "framer-motion";
import { Layers, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ServiceDialog } from "./service-dialog";

interface ServiceListProps {
    businessId: string;
    services: FullService[];
}

export default function MyServiceList({ businessId, services }: ServiceListProps) {
    const categories = useMemo(() => {
        return [...new Set(services.map((s) => s.category))];
    }, [services]);

    const isScrollingRef = useRef(false);
    const [open, setOpen] = useState(false);
    const [targetService, setTargetService] = useState<ServiceType | null>(null);

    const businessServices = services;
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]!);

    useEffect(() => {
        if (categories.length === 0) return;

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            if (isScrollingRef.current) return;

            const intersecting = entries.filter((entry) => entry.isIntersecting);
            if (intersecting.length > 0) {
                const mostVisible = intersecting.reduce((prev, current) => (prev.intersectionRatio > current.intersectionRatio ? prev : current));
                setActiveCategory(mostVisible.target.id);
            }
        };

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -60% 0px",
            threshold: [0, 0.2, 0.5, 1.0],
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        categories.forEach((cat) => {
            const el = document.getElementById(cat);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [categories]);

    function scrollToCategory(cat: string) {
        isScrollingRef.current = true;
        setActiveCategory(cat);

        const el = document.getElementById(cat);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 800);
        }
    }

    const handleCloseEditDialog = (isOpen: boolean) => {
        if (!isOpen) {
            setTargetService(null);
        }
    };

    return (
        <div className="order-2 space-y-4 lg:order-1 lg:col-span-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Layers className="text-primary" />
                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Available Services</h2>
                </div>

                <Button onClick={() => setOpen(true)} className="shadow-lg">
                    <Plus className="mr-1 size-4" />
                    Add a Service
                </Button>
            </div>

            <div className="col-span-2 space-y-4">
                <div className="bg-background/50 top-16 z-50 py-4 backdrop-blur-lg sm:sticky">
                    <Carousel opts={{ align: "start", dragFree: true }}>
                        <CarouselContent className="pl-4">
                            {categories.map((cat) => (
                                <CarouselItem key={cat} className="basis-auto pl-0">
                                    <Button
                                        variant="ghost"
                                        onClick={() => scrollToCategory(cat)}
                                        className={cn(
                                            activeCategory === cat
                                                ? "text-background hover:bg-foreground hover:text-background"
                                                : "text-muted-foreground",
                                            "relative rounded-full bg-transparent px-6 font-bold transition-colors",
                                        )}
                                    >
                                        {activeCategory === cat && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="bg-foreground absolute inset-0 z-[-1] rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        {cat}
                                    </Button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                <div className="space-y-8">
                    {categories.map((category) => {
                        const services = businessServices.filter((s) => s.category === category);
                        return (
                            <section key={category} className="scroll-mt-40 space-y-2">
                                <h2 id={category} className="scroll-mt-36 text-xl font-bold tracking-tight">
                                    {category}
                                </h2>

                                <div className="space-y-4">
                                    {services.map((service) => (
                                        <Card key={`${category}-${service.id}`} className="hover:bg-muted/50 transition-colors">
                                            <CardContent className="flex items-center justify-between px-6">
                                                <div>
                                                    <h3 className="font-semibold">{service.name}</h3>
                                                    <p className="text-muted-foreground text-xs">{service.durationInMinutes} min</p>
                                                    <p className="mt-1 text-sm font-semibold">${service.price}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <Button
                                                        onClick={() => setTargetService(service)}
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
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            <ServiceDialog businessId={businessId} open={open} setOpen={setOpen} mode="add" />
            <ServiceDialog
                mode="edit"
                open={!!targetService}
                businessId={businessId}
                setOpen={handleCloseEditDialog}
                service={targetService || undefined}
            />
        </div>
    );
}

export function Service({ services, category }: { services: ServiceType[]; category: string }) {
    return (
        <section className="scroll-mt-40 space-y-2">
            <h2 className="text-xl font-bold tracking-tight">{category}</h2>

            <div className="space-y-4">
                {services.map((service) => (
                    <Card key={`${category}-${service.id}`} className="hover:bg-muted/50 border-b transition-colors">
                        <CardContent className="flex items-center justify-between px-6">
                            <div>
                                <h3 className="font-semibold">{service.name}</h3>
                                <p className="text-muted-foreground text-xs">{service.durationInMinutes} min</p>
                                <p className="mt-1 text-sm font-semibold">${service.price}</p>
                            </div>
                            <div className="flex items-center">
                                <Button variant="ghost" className="cursor-pointer rounded-full text-xs transition-all">
                                    Edit
                                </Button>
                                <Button variant="ghost" className="cursor-pointer rounded-full text-xs transition-all">
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
