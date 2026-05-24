"use client";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryCarouselProps {
    categories: string[];
    activeCategory: string;
    scrollToCategory: (cat: string) => void;
}

export default function CategoryCarousel({ categories, activeCategory, scrollToCategory }: CategoryCarouselProps) {
    if (categories.length === 0) return null;

    return (
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
    );
}
