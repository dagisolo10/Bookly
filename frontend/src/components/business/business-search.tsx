import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FullBusiness } from "@/types/models";
import { Search, Store } from "lucide-react";
import { useState } from "react";
import BusinessCard from "./business-card";
import PaginationContainer from "./pagination-container";
import TopBusinessesDropdown from "./top-business-dropdown";

export default function BusinessSearch({ businesses, linkPath, placeholder }: { businesses: FullBusiness[]; linkPath: string; placeholder: string }) {
    const [query, setQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(8);

    const handleSearchChange = (val: string) => {
        setQuery(val);
        setCurrentPage(1);
    };

    const displayBusinesses =
        query.trim().length > 0
            ? businesses.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()) || b.location?.toLowerCase().includes(query.toLowerCase()))
            : businesses;

    const totalPages = Math.ceil(displayBusinesses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBusinesses = displayBusinesses.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-8">
            <Card className="top-20 z-50 mx-auto my-8 max-w-2xl rounded-full py-1 shadow-lg focus-within:border-white/20 sm:sticky">
                <CardContent className="flex h-12 items-center justify-between gap-2 px-4 py-2">
                    <div className="flex flex-1 items-center gap-3 px-2">
                        <Label htmlFor="query">
                            <Search className="text-muted-foreground size-5" />
                        </Label>
                        <Input
                            id="query"
                            value={query}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="border-none shadow-none focus-visible:border-none focus-visible:ring-0"
                            placeholder={placeholder}
                        />
                    </div>
                    <Separator orientation="vertical" />

                    <TopBusinessesDropdown businesses={businesses.filter((bus) => bus.status !== "Closed")} linkPath={linkPath} />
                </CardContent>
            </Card>

            {paginatedBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {paginatedBusinesses.map((business, index) => (
                        <BusinessCard key={business.id} business={business} index={index} linkPath={linkPath} />
                    ))}
                </div>
            ) : (
                <NoBusinessSearchResult />
            )}

            {totalPages > 0 && (
                <div className="mt-12 border-t pt-8">
                    <PaginationContainer
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}

function NoBusinessSearchResult() {
    return (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed">
            <Store className="text-muted-foreground mb-4 size-12" />
            <h3 className="text-xl font-semibold">No businesses match your search</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your keywords or location.</p>
        </div>
    );
}
