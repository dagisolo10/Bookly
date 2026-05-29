"use client";
import BookingSheet from "@/app/customer/_components/booking/booking-sheet";
import EmptyState from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { FullService, Service } from "@/types/models";
import { Layers, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import CategoryCarousel from "../../../app/business/_components/services/category-carousel";
import ServiceDialog from "../../../app/business/_components/services/owner-service-dialog";
import ServiceCard from "./service-card";

interface ServiceListProps {
    businessId: string;
    services: FullService[];
    linkPath: "/business/list" | "/customer/businesses";
}

export default function ServiceList({ linkPath, businessId, services }: ServiceListProps) {
    const businessMode = linkPath === "/business/list";
    const categories = useMemo(() => {
        return [...new Set(services.map((s) => s.category))];
    }, [services]);

    const isScrollingRef = useRef(false);
    const [open, setOpen] = useState(false);
    const [targetService, setTargetService] = useState<Service | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>(categories[0] ?? "");

    const [selectedService, setSelectedService] = useState<FullService | null>(null);

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
        } else {
            isScrollingRef.current = false;
        }
    }

    const handleCloseEditDialog = (isOpen: boolean) => {
        if (!isOpen) setTargetService(null);
    };

    return (
        <div className="order-2 space-y-4 lg:order-1 lg:col-span-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Layers className="text-primary" />
                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Available Services</h2>
                </div>

                {linkPath === "/business/list" && (
                    <Button onClick={() => setOpen(true)} className="shadow-lg">
                        <Plus className="mr-1 size-4" />
                        Add a Service
                    </Button>
                )}
            </div>

            {services.length === 0 ? (
                <EmptyState button="Add Service" title="No services yet" onClick={() => setOpen(true)} description="Add your first service offering to start receiving bookings." />
            ) : (
                <div className="col-span-2 space-y-4">
                    <CategoryCarousel categories={categories} activeCategory={activeCategory} scrollToCategory={scrollToCategory} />

                    <div className="space-y-8">
                        {categories.map((category) => {
                            const filtered = services.filter((s) => s.category === category);
                            return (
                                <section key={category} className="scroll-mt-40 space-y-2">
                                    <h2 id={category} className="scroll-mt-36 text-xl font-bold tracking-tight">
                                        {category}
                                    </h2>

                                    <div className="space-y-4">
                                        {filtered.map((service) =>
                                            businessMode ? (
                                                <ServiceCard key={`${category}-${service.id}`} service={service} onEdit={setTargetService} />
                                            ) : (
                                                <ServiceCard key={`${category}-${service.id}`} service={service} onBook={() => setSelectedService(service)} />
                                            ),
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={`${linkPath}/${businessId}/services`}>See All</Link>
                    </Button>
                </div>
            )}

            {businessMode && <ServiceDialog businessId={businessId} open={open} setOpen={setOpen} mode="add" />}
            {businessMode && <ServiceDialog mode="edit" open={!!targetService} businessId={businessId} setOpen={handleCloseEditDialog} service={targetService || undefined} />}
            <BookingSheet open={!!selectedService} service={selectedService} onOpenChange={() => setSelectedService(null)} />
        </div>
    );
}
