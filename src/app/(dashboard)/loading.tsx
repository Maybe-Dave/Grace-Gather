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
        <div className="space-y-8">
            <div className="space-y-2">
                <div className="h-8 w-1/3 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 rounded-xl bg-card shadow-md space-y-2">
                        <div className="flex justify-between">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
                            <div className="h-4 w-4 bg-muted animate-pulse rounded-full" />
                        </div>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
                        <div className="h-3 w-20 bg-muted animate-pulse rounded-md" />
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 p-6 rounded-xl bg-card shadow-md h-[300px] bg-muted/10 animate-pulse" />
                <div className="col-span-3 p-6 rounded-xl bg-card shadow-md h-[300px] bg-muted/10 animate-pulse" />
            </div>
        </div>
    );
}
