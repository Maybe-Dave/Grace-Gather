"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SortHeaderProps {
    label: string;
    value: string;
}

export function SortHeader({ label, value }: SortHeaderProps) {
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort");
    const currentOrder = searchParams.get("order");

    const isActive = currentSort === value;
    const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc";

    const createSortUrl = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        params.set("order", nextOrder);
        return `?${params.toString()}`;
    };

    return (
        <Link href={createSortUrl()} className="flex items-center gap-1 hover:text-foreground transition-colors group">
            {label}
            {isActive ? (
                currentOrder === "asc" ? (
                    <ArrowUp className="h-3 w-3" />
                ) : (
                    <ArrowDown className="h-3 w-3" />
                )
            ) : (
                <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            )}
        </Link>
    );
}
