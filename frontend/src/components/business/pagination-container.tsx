import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../ui/pagination";

import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";

interface PaginationContainerProps {
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    setItemsPerPage: Dispatch<SetStateAction<number>>;
}

export default function PaginationContainer({ currentPage, totalPages, onPageChange, itemsPerPage, setItemsPerPage }: PaginationContainerProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
                <Label htmlFor="rows-per-page" className="text-muted-foreground text-sm font-medium">
                    Businesses per page
                </Label>

                <Select
                    onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        onPageChange(1);
                    }}
                    value={String(itemsPerPage)}
                >
                    <SelectTrigger className="w-20 rounded-full" id="rows-per-page">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {[8, 16, 24, 32].map((num) => (
                            <SelectItem key={num} value={String(num)}>
                                {num}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                            <PaginationPrevious />
                        </Button>
                    </PaginationItem>

                    <div className="px-4 text-sm font-medium">
                        {currentPage} of {totalPages}
                    </div>

                    <PaginationItem>
                        <Button variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
                            <PaginationNext />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
