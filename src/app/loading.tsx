"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function Loading() {
    useEffect(() => {
        const toastId = toast.loading("Fetching data...");
        return () => {
            toast.dismiss(toastId);
        };
    }, []);

    return (
        <div className="min-h-screen p-8 space-y-8 container mx-auto">
            <div className="space-y-4">
                <div className="h-12 w-1/3 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded-md" />
            </div>

            <div className="space-y-4">
                <div className="h-64 w-full bg-muted animate-pulse rounded-xl" />
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="h-32 bg-muted animate-pulse rounded-xl" />
                    <div className="h-32 bg-muted animate-pulse rounded-xl" />
                    <div className="h-32 bg-muted animate-pulse rounded-xl" />
                </div>
            </div>
        </div>
    );
}
