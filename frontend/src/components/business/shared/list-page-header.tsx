import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

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
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={placeholder}
                    />
                </div>
                {isFetching && <Spinner className="size-4" />}
            </div>
        </>
    );
}
