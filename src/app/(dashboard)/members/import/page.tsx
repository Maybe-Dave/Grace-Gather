"use client"

import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportMembersPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/import", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    router.push("/members");
                    router.refresh();
                }, 2000);
            } else {
                setMessage("Failed to import members: " + data.error);
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/members"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-9 w-9"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Import Members</h2>
            </div>

            <div className="bg-card border rounded-xl p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium">Upload Excel File</h3>
                        <p className="text-sm text-muted-foreground">
                            Select an .xlsx or .csv file containing member data.
                        </p>
                    </div>

                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    XLSX or CSV (MAX. 5MB)
                                </p>
                            </div>
                            <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                accept=".xlsx,.csv"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {file && (
                        <div className="text-sm text-center font-medium text-primary">
                            Selected: {file.name}
                        </div>
                    )}

                    {message && (
                        <div className={`text-sm text-center font-medium ${message.includes("Failed") ? "text-destructive" : "text-green-600"}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        {uploading ? "Importing..." : "Start Import"}
                    </button>
                </form>
            </div>
        </div>
    );
}
