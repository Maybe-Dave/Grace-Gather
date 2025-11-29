"use client"

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Member {
    _id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    phoneNumbers: string[];
    address: string;
    status: string;
    ministry?: string;
    occupation?: string;
    emergencyContact?: string;
    notes?: string;
}

export default function MemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [member, setMember] = useState<Member | null>(null);

    const userRole = session?.user?.role || "Viewer";
    const isReadOnly = userRole === "Viewer";

    useEffect(() => {
        async function fetchMember() {
            try {
                const res = await fetch(`/api/members/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMember(data);
                } else {
                    toast.error("Member not found");
                    router.push("/members");
                }
            } catch (error) {
                console.error("Failed to fetch member", error);
                toast.error("Failed to fetch member details");
            } finally {
                setLoading(false);
            }
        }
        fetchMember();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!member || isReadOnly) return;
        const { name, value } = e.target;
        setMember((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handlePhoneChange = (index: number, value: string) => {
        if (!member || isReadOnly) return;
        const newPhones = [...member.phoneNumbers];
        newPhones[index] = value;
        setMember((prev) => (prev ? { ...prev, phoneNumbers: newPhones } : null));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member || isReadOnly) return;
        setSaving(true);

        try {
            const res = await fetch(`/api/members/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(member),
            });

            if (res.ok) {
                toast.success("Member updated successfully");
                router.refresh();
                router.push("/members");
            } else {
                toast.error("Failed to update member");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this member?")) return;

        try {
            const res = await fetch(`/api/members/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Member deleted successfully");
                router.push("/members");
                router.refresh();
            } else {
                toast.error("Failed to delete member");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!member) return <div>Member not found</div>;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/members"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-9 w-9"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isReadOnly ? "Member Details" : "Edit Member"}
                    </h2>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-destructive/10 hover:text-destructive h-9 px-4 py-2"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <input
                            name="firstName"
                            required
                            disabled={isReadOnly}
                            value={member.firstName}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <input
                            name="lastName"
                            required
                            disabled={isReadOnly}
                            value={member.lastName}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Gender</label>
                        <select
                            name="gender"
                            value={member.gender}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date of Birth (DD/MM)</label>
                        <input
                            name="dob"
                            placeholder="DD/MM"
                            required
                            disabled={isReadOnly}
                            value={member.dob}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                        value={member.phoneNumbers[0]}
                        onChange={(e) => handlePhoneChange(0, e.target.value)}
                        placeholder="08012345678"
                        required
                        disabled={isReadOnly}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <textarea
                        name="address"
                        required
                        disabled={isReadOnly}
                        value={member.address}
                        onChange={handleChange}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            name="status"
                            value={member.status}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Visitor">Visitor</option>
                            <option value="Member">Member</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ministry (Optional)</label>
                        <input
                            name="ministry"
                            value={member.ministry || ""}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Occupation (Optional)</label>
                        <input
                            name="occupation"
                            value={member.occupation || ""}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Emergency Contact (Optional)</label>
                        <input
                            name="emergencyContact"
                            value={member.emergencyContact || ""}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        value={member.notes || ""}
                        onChange={handleChange}
                        disabled={isReadOnly}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {!isReadOnly && (
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/members"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            {saving ? "Saving..." : "Update Member"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
