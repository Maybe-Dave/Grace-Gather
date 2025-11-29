"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { toast } from "sonner";

interface MemberActionsProps {
    memberId: string;
    memberName: string;
    role: string;
}

export function MemberActions({ memberId, memberName, role }: MemberActionsProps) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const allowedRoles = ["Super Admin", "Member Manager"];
    const canManage = allowedRoles.includes(role);

    if (!canManage) {
        return (
            <Link
                href={`/members/${memberId}`}
                className="text-primary hover:underline text-sm font-medium"
            >
                View
            </Link>
        );
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/members/${memberId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Member deleted successfully");
                router.refresh();
                setShowDeleteModal(false);
            } else {
                toast.error("Failed to delete member");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Link
                    href={`/members/${memberId}`}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit Member"
                >
                    <Edit className="h-4 w-4" />
                </Link>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    title="Delete Member"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Member"
                loading={isDeleting}
            >
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete <strong>{memberName}</strong>? This action cannot be undone.
                </p>
            </ConfirmationModal>
        </>
    );
}
