"use client"

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await fetch("/api/members");
                const data = await res.json();
                setMembers(data);
            } catch (error) {
                console.error("Failed to fetch members", error);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                router.push("/attendance");
                router.refresh();
            } else {
                alert("Failed to mark attendance");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

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

            <form onSubmit={handleSubmit} className="space-y-8">
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
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Select Attendees</h3>
                        <span className="text-sm text-muted-foreground">
                            {selectedMembers.size} selected
                        </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            <div>Loading members...</div>
                        ) : (
                            members.map((member) => (
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
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        {submitting ? "Saving..." : "Save Attendance"}
                    </button>
                </div>
            </form>
        </div>
    );
}
