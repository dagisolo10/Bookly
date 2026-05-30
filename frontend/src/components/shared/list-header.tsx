import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Search, Sparkles } from "lucide-react";
import Link from "next/link";

interface ListHeaderProps {
    owner?: boolean;

    query: string;
    title: string;
    tag?: string;
    description: string;

    isFetching: boolean;
    placeholder: string;

    addHref?: string;
    buttonLabel?: string;

    onAdd?: () => void;
    onSearchChange: (value: string) => void;
}

export default function ListHeader({ owner, title, description, tag, query, onSearchChange, isFetching, placeholder, buttonLabel, onAdd, addHref }: ListHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="max-w-xl">
                    {tag && (
                        <div className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                            <Sparkles size={16} className="fill-yellow-500 text-yellow-500" />
                            <span>{tag}</span>
                        </div>
                    )}
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
                </div>

                {owner &&
                    (addHref ? (
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
                    ))}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative max-w-sm flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input type="search" value={query} aria-label={placeholder} className="pl-9" placeholder={placeholder} onChange={(e) => onSearchChange(e.target.value)} />
                </div>
                {isFetching && <Spinner className="size-4" />}
            </div>
        </div>
    );
}
