"use client"

import Link from "next/link";
import { ArrowLeft, Check, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/confirmation-modal";

interface Member {
    _id: string;
    firstName: string;
    lastName: string;
}

export default function MarkAttendancePage() {
    const router = useRouter();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [serviceType, setServiceType] = useState("Sunday Service");
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await fetch("/api/members");
                const data = await res.json();
                // Fix: API returns array directly
                setMembers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch members", error);
                toast.error("Failed to fetch members");
            } finally {
                setLoading(false);
            }
        }
        fetchMembers();
    }, []);

    const toggleMember = (id: string) => {
        const newSelected = new Set(selectedMembers);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedMembers(newSelected);
    };

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (serviceType === "Sunday Service") {
            const selectedDate = new Date(date);
            // getDay() returns 0 for Sunday
            if (selectedDate.getDay() !== 0) {
                toast.error("Sunday Service must be on a Sunday");
                return;
            }
        }

        if (selectedMembers.size === 0) {
            toast.error("Please select at least one attendee");
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        setSubmitting(true);

        try {
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    serviceType,
                    attendees: Array.from(selectedMembers),
                }),
            });

            if (res.ok) {
                toast.success("Attendance marked successfully");
                router.push("/attendance");
                router.refresh();
            } else {
                toast.error("Failed to mark attendance");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
            setShowConfirmModal(false);
        }
    };

    // Filter members based on search
    const filteredMembers = members.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get selected member names for modal
    const selectedMemberNames = members
        .filter(m => selectedMembers.has(m._id))
        .map(m => `${m.firstName} ${m.lastName}`);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/attendance"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-9 w-9"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Service Type</label>
                        <select
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Sunday Service">Sunday Service</option>
                            <option value="Midweek Service">Midweek Service</option>
                            <option value="Special Event">Special Event</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-medium">Select Attendees</h3>
                            <span className="text-sm text-muted-foreground">
                                {selectedMembers.size} selected
                            </span>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[500px] overflow-y-auto p-1">
                        {loading ? (
                            <div className="col-span-full text-center py-8 text-muted-foreground">Loading members...</div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-muted-foreground">No members found.</div>
                        ) : (
                            filteredMembers.map((member) => (
                                <div
                                    key={member._id}
                                    onClick={() => toggleMember(member._id)}
                                    className={`cursor-pointer rounded-lg border p-4 flex items-center justify-between transition-colors ${selectedMembers.has(member._id)
                                        ? "bg-primary/10 border-primary"
                                        : "hover:bg-muted"
                                        }`}
                                >
                                    <span className="font-medium">
                                        {member.firstName} {member.lastName}
                                    </span>
                                    {selectedMembers.has(member._id) && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link
                        href="/attendance"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Review & Save
                    </button>
                </div>
            </form>

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSubmit}
                title="Confirm Attendance"
                loading={submitting}
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        You are about to mark attendance for <strong>{selectedMembers.size}</strong> people on <strong>{new Date(date).toLocaleDateString()}</strong>.
                    </p>
                    <div className="rounded-md border p-2 bg-muted/50 max-h-[200px] overflow-y-auto">
                        <ul className="text-sm space-y-1">
                            {selectedMemberNames.map((name, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Check className="h-3 w-3 text-green-500" /> {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </ConfirmationModal>
        </div>
    );
}
