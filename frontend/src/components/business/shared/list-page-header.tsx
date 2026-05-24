import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ListPageHeaderProps {
    title: string;
    description: string;
    query: string;
    onSearchChange: (value: string) => void;
    isFetching: boolean;
    placeholder: string;
    buttonLabel: string;
    onAdd?: () => void;
    addHref?: string;
}

export default function ListPageHeader({ title, description, query, onSearchChange, isFetching, placeholder, buttonLabel, onAdd, addHref }: ListPageHeaderProps) {
    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
                </div>

                {addHref ? (
                    <Button asChild>
                        <Link href={addHref}>
                            <Plus className="size-4" />
                            {buttonLabel}
                        </Link>
                    </Button>
                ) : (
                    <Button onClick={onAdd}>
                        <Plus className="size-4" />
                        {buttonLabel}
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative max-w-sm flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        value={query}
                        className="pl-9"
                        placeholder={placeholder}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                {isFetching && <Spinner className="size-4" />}
            </div>
        </>
    );
}
