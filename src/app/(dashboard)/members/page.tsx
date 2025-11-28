"use client"

import Link from "next/link";
import { Plus, Search, Upload } from "lucide-react";
import { useEffect, useState } from "react";

interface Member {
    _id: string;
    firstName: string;
    lastName: string;
    status: string;
    phoneNumbers: string[];
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Members</h2>
                    <p className="text-muted-foreground">
                        Manage your church members and visitors.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/members/import"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <Upload className="mr-2 h-4 w-4" /> Import
                    </Link>
                    <Link
                        href="/members/new"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Member
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search members..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="rounded-md bg-card shadow-md">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Phone
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : members.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                        No members found.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr
                                        key={member._id}
                                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        <td className="p-4 align-middle font-medium">
                                            {member.firstName} {member.lastName}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${member.status === "Member"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                    : member.status === "Visitor"
                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                                    }`}
                                            >
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {member.phoneNumbers[0]}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Link
                                                href={`/members/${member._id}`}
                                                className="text-primary hover:underline mr-4"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/members/${member._id}/edit`}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
