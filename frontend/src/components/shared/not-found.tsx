import { SearchX } from "lucide-react";

interface NotFoundProps {
    message?: string;
    className?: string;
}

export default function NotFound({ message = "The requested resource could not be found.", className }: NotFoundProps) {
    return (
        <div className={`flex min-h-[50vh] flex-col items-center justify-center gap-4 ${className ?? ""}`}>
            <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                <SearchX className="text-muted-foreground size-6" />
            </div>
            <p className="text-muted-foreground max-w-sm text-center text-sm font-medium">{message}</p>
        </div>
    );
}
