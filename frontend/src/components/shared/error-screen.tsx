import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorScreenProps {
    message?: string;
    className?: string;
    onRetry?: () => void;
}

export default function ErrorScreen({ message = "Something went wrong. Please try again.", className, onRetry }: ErrorScreenProps) {
    return (
        <div className={`flex min-h-[50vh] flex-col items-center justify-center gap-4 ${className ?? ""}`}>
            <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
                <AlertTriangle className="text-destructive size-6" />
            </div>
            <p className="text-destructive max-w-sm text-center text-sm font-medium">{message}</p>
            {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
                    <RefreshCw className="size-3.5" />
                    Try again
                </Button>
            )}
        </div>
    );
}
