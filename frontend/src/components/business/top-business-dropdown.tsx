import Link from "next/link";
import { Store } from "lucide-react";
import { FullBusiness } from "@/types/models";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";

export default function TopBusinessesDropdown({ businesses, linkPath }: { businesses: FullBusiness[]; linkPath: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden rounded-full font-semibold text-zinc-600 hover:bg-zinc-100 md:flex">
                    Quick Browse Top
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 rounded-2xl p-2" align="end">
                <DropdownMenuLabel className="px-3 pt-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                    Top Rated Businesses
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                {businesses.map((business) => (
                    <Link key={business.id} href={`${linkPath}/${business.id}`}>
                        <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-xl p-2 focus:bg-zinc-50">
                            <div className="relative size-10 overflow-hidden rounded-lg bg-zinc-600">
                                <div className="grid h-full place-items-center">
                                    <Store className="size-4" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-zinc-800">{business.name}</span>
                                <span className="line-clamp-1 text-xs text-zinc-500">{business.location}</span>
                            </div>
                        </DropdownMenuItem>
                    </Link>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
