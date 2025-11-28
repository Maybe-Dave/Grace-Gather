import { Sidebar } from "@/components/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full">
                <div className="flex items-center justify-between p-8 pb-0">
                    <div className="relative w-96">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="search"
                            placeholder="Search..."
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            U
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
