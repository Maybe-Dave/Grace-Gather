import Link from "next/link";
import { Plus, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
import { Search } from "@/components/search";
import { SortHeader } from "@/components/sort-header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MemberActions } from "@/components/member-actions";

export default async function MembersPage(props: {
    searchParams: Promise<{
        query?: string;
        page?: string;
        sort?: string;
        order?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const sort = searchParams?.sort || "firstName"; // Default sort by Name
    const order = searchParams?.order === "desc" ? -1 : 1; // Default Ascending
    const page = Number(searchParams?.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "Viewer";
    const canManage = ["Super Admin", "Member Manager"].includes(userRole);

    await dbConnect();

    const filter = query
        ? {
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
            ],
        }
        : {};

    const members = await Member.find(filter)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit);

    const totalMembers = await Member.countDocuments(filter);
    const totalPages = Math.ceil(totalMembers / limit);

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
                    {canManage && (
                        <>
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
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Search placeholder="Search members..." />
            </div>

            <div className="rounded-md bg-card shadow-md">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead>
                            <tr className="bg-muted/50 hover:bg-muted/50 transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground rounded-tl-md">
                                    <SortHeader label="Name" value="firstName" />
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    <SortHeader label="Status" value="status" />
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Phone
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground rounded-tr-md">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                        No members found.
                                    </td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr
                                        key={member._id.toString()}
                                        className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
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
                                                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                                    }`}
                                            >
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {member.phoneNumbers[0]}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <MemberActions
                                                memberId={member._id.toString()}
                                                memberName={`${member.firstName} ${member.lastName}`}
                                                role={userRole}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {skip + 1} to {Math.min(skip + limit, totalMembers)} of {totalMembers} members
                </p>
                <div className="flex items-center space-x-2">
                    <Link
                        href={{
                            query: { ...searchParams, page: page > 1 ? page - 1 : 1 },
                        }}
                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <div className="text-sm font-medium">
                        Page {page} of {totalPages}
                    </div>
                    <Link
                        href={{
                            query: { ...searchParams, page: page < totalPages ? page + 1 : totalPages },
                        }}
                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
