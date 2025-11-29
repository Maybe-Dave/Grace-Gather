"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SessionTimeout() {
    const { data: session } = useSession();
    const router = useRouter();
    const [lastActivity, setLastActivity] = useState(Date.now());

    useEffect(() => {
        if (!session) return;

        // Timeout duration in milliseconds (30 minutes)
        const TIMEOUT_MS = 30 * 60 * 1000;

        const handleActivity = () => {
            setLastActivity(Date.now());
        };

        // Events to track activity
        const events = ["mousedown", "keydown", "scroll", "touchstart"];

        // Add event listeners
        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        // Check for inactivity every minute
        const intervalId = setInterval(() => {
            const now = Date.now();
            if (now - lastActivity >= TIMEOUT_MS) {
                signOut({ callbackUrl: "/login" });
            }
        }, 60000); // Check every minute

        return () => {
            // Cleanup
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
            clearInterval(intervalId);
        };
    }, [session, lastActivity, router]);

    return null;
}
