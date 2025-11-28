"use client"

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "Male",
        dob: "",
        phoneNumbers: [""],
        address: "",
        status: "Visitor",
        ministry: "",
        occupation: "",
        emergencyContact: "",
        notes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (index: number, value: string) => {
        const newPhones = [...formData.phoneNumbers];
        newPhones[index] = value;
        setFormData((prev) => ({ ...prev, phoneNumbers: newPhones }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/members");
                router.refresh();
            } else {
                alert("Failed to create member");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/members"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-9 w-9"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Add New Member</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <input
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <input
                            name="lastName"
                            required
                            value={formData.lastName}
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
                            value={formData.gender}
                            onChange={handleChange}
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
                            value={formData.dob}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                        value={formData.phoneNumbers[0]}
                        onChange={(e) => handlePhoneChange(0, e.target.value)}
                        placeholder="08012345678"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <textarea
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
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
                            value={formData.ministry}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Occupation (Optional)</label>
                        <input
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Emergency Contact (Optional)</label>
                        <input
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Link
                        href="/members"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        {loading ? "Saving..." : "Save Member"}
                    </button>
                </div>
            </form>
        </div>
    );
}
