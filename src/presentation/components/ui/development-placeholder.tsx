import { Construction } from "lucide-react";
import { cn } from "@/shared/utils";

interface DevelopmentPlaceholderProps {
    title?: string;
    message?: string;
    className?: string;
}

export function DevelopmentPlaceholder({
    title = "Fonctionnalité en développement",
    message = "Nous travaillons actuellement sur cette section pour vous offrir des données encore plus précises.",
    className,
}: DevelopmentPlaceholderProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50",
            className
        )}>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Construction className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 max-w-sm">
                {message}
            </p>
        </div>
    );
}
