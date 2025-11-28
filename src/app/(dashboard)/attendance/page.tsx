"use client"

import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface AttendanceRecord {
    _id: string;
    date: string;
    serviceType: string;
    attendees: { firstName: string; lastName: string }[];
}

export default function AttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAttendance() {
            try {
                const res = await fetch("/api/attendance");
                const data = await res.json();
                setRecords(data);
            } catch (error) {
                console.error("Failed to fetch attendance", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAttendance();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
                    <p className="text-muted-foreground">
                        Track and manage service attendance.
                    </p>
                </div>
                <Link
                    href="/attendance/mark"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <Plus className="mr-2 h-4 w-4" /> Mark Attendance
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div>Loading...</div>
                ) : records.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground">
                        No attendance records found.
                    </div>
                ) : (
                    records.map((record) => (
                        <div
                            key={record._id}
                            className="rounded-xl border bg-card text-card-foreground shadow-sm"
                        >
                            <div className="p-6 flex flex-col space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold leading-none tracking-tight">
                                        {new Date(record.date).toLocaleDateString()}
                                    </h3>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">{record.serviceType}</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="text-2xl font-bold">
                                    {record.attendees.length} Attendees
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
