"use client"

import Link from "next/link";
import { Plus, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

interface Event {
    _id: string;
    title: string;
    date: string;
    type: string;
    description?: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Events</h2>
                    <p className="text-muted-foreground">
                        Manage upcoming church events.
                    </p>
                </div>
                <Link
                    href="/events/new"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div>Loading...</div>
                ) : events.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground">
                        No events found.
                    </div>
                ) : (
                    events.map((event) => (
                        <div
                            key={event._id}
                            className="rounded-xl bg-card text-card-foreground shadow-md"
                        >
                            <div className="p-6 flex flex-col space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold leading-none tracking-tight">
                                        {event.title}
                                    </h3>
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(event.date).toLocaleDateString()} • {event.type}
                                </p>
                            </div>
                            <div className="p-6 pt-0">
                                <p className="text-sm text-muted-foreground">
                                    {event.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
