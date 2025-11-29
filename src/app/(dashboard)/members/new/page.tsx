"use client"

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { toast } from "sonner";

export default function NewMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handlePhoneChange = (index: number, value: string) => {
        const newPhones = [...formData.phoneNumbers];
        newPhones[index] = value;
        setFormData((prev) => ({ ...prev, phoneNumbers: newPhones }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // DOB Validation (DD/MM)
        const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
        if (!formData.dob) {
            newErrors.dob = "Date of Birth is required";
        } else if (!dobRegex.test(formData.dob)) {
            newErrors.dob = "Invalid format. Use DD/MM (e.g., 31/01)";
        }

        // Required fields (redundant with HTML required but good for custom UI)
        if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";

        const phone = formData.phoneNumbers[0].trim();
        const phoneRegex = /^0\d{10}$/;
        if (!phone) {
            newErrors.phoneNumbers = "Phone Number is required";
        } else if (!phoneRegex.test(phone)) {
            newErrors.phoneNumbers = "Phone number must be 11 digits and start with 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setShowModal(true);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Member created successfully");
                router.push("/members");
                router.refresh();
            } else {
                toast.error("Failed to create member");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
            setShowModal(false);
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
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.firstName ? "border-red-500" : "border-input"}`}
                        />
                        {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.lastName ? "border-red-500" : "border-input"}`}
                        />
                        {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
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
                            value={formData.dob}
                            onChange={handleChange}
                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.dob ? "border-red-500" : "border-input"}`}
                        />
                        {errors.dob && <p className="text-xs text-red-500">{errors.dob}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                        value={formData.phoneNumbers[0]}
                        onChange={(e) => handlePhoneChange(0, e.target.value)}
                        placeholder="08012345678"
                        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.phoneNumbers ? "border-red-500" : "border-input"}`}
                    />
                    {errors.phoneNumbers && <p className="text-xs text-red-500">{errors.phoneNumbers}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.address ? "border-red-500" : "border-input"}`}
                    />
                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
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
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Review & Save
                    </button>
                </div>
            </form>

            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirm}
                title="Confirm Member Details"
                loading={loading}
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Please review the details below before saving.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold block">Full Name:</span>
                            {formData.firstName} {formData.lastName}
                        </div>
                        <div>
                            <span className="font-semibold block">Gender:</span>
                            {formData.gender}
                        </div>
                        <div>
                            <span className="font-semibold block">Date of Birth:</span>
                            {formData.dob}
                        </div>
                        <div>
                            <span className="font-semibold block">Phone:</span>
                            {formData.phoneNumbers[0]}
                        </div>
                        <div>
                            <span className="font-semibold block">Status:</span>
                            {formData.status}
                        </div>
                        <div className="col-span-2">
                            <span className="font-semibold block">Address:</span>
                            {formData.address}
                        </div>
                        {formData.ministry && (
                            <div>
                                <span className="font-semibold block">Ministry:</span>
                                {formData.ministry}
                            </div>
                        )}
                        {formData.occupation && (
                            <div>
                                <span className="font-semibold block">Occupation:</span>
                                {formData.occupation}
                            </div>
                        )}
                    </div>
                </div>
            </ConfirmationModal>
        </div>
    );
}
