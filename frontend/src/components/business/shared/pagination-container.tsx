import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationContainerProps {
    total: number;
    hasMore: boolean;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    ITEMS_PER_PAGE_OPTIONS: readonly number[];

    onValueChange: (val: string) => void;
    setCurrentPage: (page: number) => void;
}

export default function PaginationContainer(props: PaginationContainerProps) {
    const { hasMore, total, itemsPerPage, currentPage, setCurrentPage, totalPages, ITEMS_PER_PAGE_OPTIONS, onValueChange } = props;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);

    return (
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Rows per page</span>

                    <Select onValueChange={onValueChange} value={String(itemsPerPage)}>
                        <SelectTrigger className="h-8 w-16">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                                <SelectItem key={n} value={String(n)}>
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <span className="text-muted-foreground text-sm">
                    {total === 0 ? 0 : start} – {end} of {total}
                </span>
            </div>

            <Pagination className="mx-0 w-auto">
                <PaginationContent className="px-2">
                    <PaginationItem>
                        <button type="button" title="pagination next" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>
                            <PaginationPrevious />
                        </button>
                    </PaginationItem>

                    <span className="text-muted-foreground text-sm">
                        Page {currentPage} of {totalPages}
                    </span>

                    <PaginationItem>
                        <button type="button" title="pagination previous" disabled={!hasMore} onClick={() => setCurrentPage(currentPage + 1)}>
                            <PaginationNext />
                        </button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
