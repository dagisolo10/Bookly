"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCloseBusiness, useToggleBusiness } from "@/hooks/tan stack/use-owner-business";
import { FullBusiness } from "@/types/models";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Info, LayoutDashboard } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BusinessSettingsForm from "./business-settings-form";

export default function BusinessSettings({ initialData }: { initialData: FullBusiness }) {
    const [activeSection, setActiveSection] = useState<string>("General");

    const generalRef = useRef<HTMLDivElement>(null);
    const scheduleRef = useRef<HTMLDivElement>(null);
    const brandingRef = useRef<HTMLDivElement>(null);

    const scrollNavigation = [
        { ref: generalRef, section: "General", label: "General", icon: <Info className="size-4" /> },
        { ref: scheduleRef, section: "Schedule", label: "Schedule", icon: <Clock className="size-4" /> },
        { ref: brandingRef, section: "Branding", label: "Branding", icon: <LayoutDashboard className="size-4" /> },
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -60% 0px",
        };

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        const sections = [generalRef, scheduleRef, brandingRef];

        sections.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="space-y-8">
            <div className="border-b py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <span className="hover:text-foreground cursor-pointer transition-colors duration-300">Businesses</span>
                        <ChevronRight className="size-4" />
                        <span className="hover:text-foreground cursor-pointer transition-colors duration-300">{initialData.name}</span>
                        <ChevronRight className="size-4" />
                        <span className="text-foreground font-medium">Settings</span>
                    </div>
                </div>
            </div>

            <div className="screen py-0">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.2fr_0.8fr]">
                    <aside className="hidden lg:block">
                        <nav className="sticky top-24 space-y-1">
                            {scrollNavigation.map((button) => (
                                <button key={button.section} type="button" onClick={() => scrollToSection(button.ref)} className={`${activeSection === button.section ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-900"} relative flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors`}>
                                    {activeSection === button.section && <motion.div layoutId="active-pill" className="absolute inset-0 -z-1 rounded-full bg-black" transition={{ type: "spring", bounce: 0.3, duration: 0.6 }} />}
                                    {button.icon} {button.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                            <p className="text-muted-foreground text-sm">Update your business identity and availability.</p>
                        </div>

                        <BusinessSettingsForm initialData={initialData} />
                    </div>
                </div>
            </div>

            <DangerZone business={initialData} />
        </div>
    );
}

type Method = "pause" | "activate" | "close" | null;

function DangerZone({ business }: { business: FullBusiness }) {
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [method, setMethod] = useState<Method>(null);

    const { mutateAsync: toggleBusiness } = useToggleBusiness();
    const { mutateAsync: closeBusiness } = useCloseBusiness();

    async function onConfirm() {
        const actionPromise = method === "close" ? closeBusiness(business.id) : toggleBusiness(business.id);

        toast.promise(actionPromise, {
            loading: method === "close" ? "Permanently closing business..." : "Updating visibility status...",
            success: (message) => {
                setShowConfirm(false);
                return message;
            },
            error: (err) => err?.message || "An unexpected error occurred.",
        });
    }

    return (
        <div className="border border-red-200 bg-red-50/50 p-6">
            <h3 className="text-sm font-bold tracking-widest text-red-900 uppercase">Danger Zone</h3>
            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="font-bold text-red-900">Close Business Temporarily</p>
                    <p className="text-xs text-red-700">Hide your shop from customers. You can re-open anytime.</p>
                </div>
                {business.status !== "Closed" && (
                    <Button
                        type="button"
                        onClick={() => {
                            setShowConfirm(true);
                            setMethod(business.status === "Active" ? "pause" : "activate");
                        }}
                        variant="outline"
                        className="border-red-200 text-red-900 hover:bg-red-100"
                    >
                        {business.status === "Active" ? "Pause Business" : "Activate Business"}
                    </Button>
                )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-red-100 pt-6">
                <div>
                    <p className="font-bold text-red-900">Delete Permanently</p>
                    <p className="text-xs text-red-700">This will delete all services, images, and history. This cannot be undone.</p>
                </div>
                <Button
                    type="button"
                    onClick={() => {
                        setShowConfirm(true);
                        setMethod("close");
                    }}
                    variant="destructive"
                >
                    Close Business
                </Button>
            </div>
            <Confirmation method={method} showConfirm={showConfirm} onConfirm={onConfirm} setShowConfirm={setShowConfirm} />
        </div>
    );
}

interface ConfirmationProps {
    showConfirm: boolean;
    setShowConfirm: Dispatch<SetStateAction<boolean>>;
    onConfirm: () => void;
    method: Method;
}

function Confirmation({ showConfirm, onConfirm, setShowConfirm, method }: ConfirmationProps) {
    const texts = {
        Activation: {
            title: "Resume Business Operations?",
            desc: "This will make your business and services visible to customers again. You will be able to receive new bookings.",
            confirm: "Activate Business",
            cancel: "Keep Paused",
        },
        Pausing: {
            title: "Pause Business Temporarily?",
            desc: "This will hide your business and services from the public. You won’t receive new bookings, but your existing confirmed bookings remain active.",
            confirm: "Pause Business",
            cancel: "Go Back",
        },
        Closing: {
            title: "Permanently Close Business?",
            desc: "This action is final. All services and images will be deleted, and pending bookings will be cancelled. This cannot be undone.",
            confirm: "Close Business Permanently",
            cancel: "Keep Business Open",
        },
    };

    return (
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent size="default">
                <AlertDialogHeader>
                    <AlertDialogTitle>{method === "activate" ? texts.Activation.title : method === "pause" ? texts.Pausing.title : texts.Closing.title}</AlertDialogTitle>
                    <AlertDialogDescription>{method === "activate" ? texts.Activation.desc : method === "pause" ? texts.Pausing.desc : texts.Closing.desc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{method === "activate" ? texts.Activation.cancel : method === "pause" ? texts.Pausing.cancel : texts.Closing.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} variant="destructive">
                        {method === "activate" ? texts.Activation.confirm : method === "pause" ? texts.Pausing.confirm : texts.Closing.confirm}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
