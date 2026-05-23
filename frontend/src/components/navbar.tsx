"use client";
import { syncUserQueryOptions } from "@/hooks/query-options";
import { useBecomeBusinessOwner } from "@/hooks/use-user";
import { UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const ROUTE_MAP = {
    Admin: [{ label: "Admin Console", path: "/admin/dashboard" }],
    Business: [{ label: "My Businesses", path: "/business/list" }],
    Customer: [
        // { label: "My Bookings", path: "/customer/bookings" },
        { label: "Find Services", path: "/customer/" },
        // { label: "Browse Businesses", path: "/customer/businesses" },
    ],
    Visitor: [
        { label: "About", path: "/about" },
        { label: "Support", path: "/support" },
    ],
} as const;

export default function Navbar() {
    const { data: user } = useQuery(syncUserQueryOptions());
    const { mutate } = useBecomeBusinessOwner();

    const pathname = usePathname();
    const hidden = ["/onboard"];
    const isHidden = hidden.includes(pathname);

    if (isHidden) return null;

    const currentSection = pathname.startsWith("/admin")
        ? "Admin"
        : pathname.startsWith("/business")
          ? "Business"
          : pathname.startsWith("/customer")
            ? "Customer"
            : "Visitor";

    // const routes = ROUTE_MAP[currentSection];
    const routes = [...ROUTE_MAP.Business, ...ROUTE_MAP.Customer, ...ROUTE_MAP.Visitor];

    const hasAdminRole = user?.roles.includes("Admin");
    const hasBusinessRole = user?.roles.includes("Business");

    return (
        <header className="sticky top-0 z-50 border-b px-8 backdrop-blur-md">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between">
                <Link className="font-font text-xl tracking-tight transition-opacity hover:opacity-80 md:text-2xl" href="/">
                    Bookly.
                </Link>

                <div className="hidden items-center gap-2 font-medium sm:flex">
                    {routes.map((route) => (
                        <Button
                            key={route.path}
                            asChild
                            className={
                                pathname === route.path
                                    ? "bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-300"
                                    : "bg-transparent text-zinc-600 hover:bg-zinc-100"
                            }
                        >
                            <Link href={route.path}>{route.label}</Link>
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonPopoverCard: {
                                    pointerEvents: "initial",
                                },
                            },
                        }}
                    >
                        <UserButton.MenuItems>
                            {hasBusinessRole && currentSection !== "Business" && (
                                <UserButton.Link label="Switch to Business" labelIcon={<Briefcase className="size-4" />} href="/business/" />
                            )}

                            {currentSection === "Business" && (
                                <UserButton.Link label="Switch to Customer" labelIcon={<User className="size-4" />} href="/customer/" />
                            )}

                            {hasAdminRole && currentSection !== "Admin" && (
                                <UserButton.Link label="Admin Dashboard" labelIcon={<Settings className="size-4" />} href="/admin/" />
                            )}

                            {!hasBusinessRole && (
                                <UserButton.Action label="Start a business" labelIcon={<Briefcase className="size-4" />} onClick={mutate} />
                            )}
                        </UserButton.MenuItems>
                    </UserButton>
                </div>
            </nav>
        </header>
    );
}
