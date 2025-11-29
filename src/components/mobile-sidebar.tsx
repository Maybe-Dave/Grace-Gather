"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
                <Menu className="h-6 w-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[90] bg-black/50 md:hidden"
                        />

                        {/* Sidebar Panel */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 z-[100] w-72 bg-gray-900 md:hidden"
                        >
                            <div className="relative h-full">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute right-4 top-4 z-50 p-2 text-gray-400 hover:text-white"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                                <Sidebar />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
