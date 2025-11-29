import { Users, CalendarCheck, CalendarDays, TrendingUp } from "lucide-react";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";
import Event from "@/models/Event";
import { AttendanceChart } from "@/components/attendance-chart";

export default async function DashboardPage() {
    await dbConnect();

    // Fetch counts
    const totalMembers = await Member.countDocuments({ status: { $ne: "Visitor" } });
    const totalVisitors = await Member.countDocuments({ status: "Visitor" });
    const totalPeople = await Member.countDocuments({});

    // Fetch recent attendance for chart and average
    const recentAttendance = await Attendance.find().sort({ date: -1 }).limit(6);
    const chartData = recentAttendance.map(record => ({
        name: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: record.attendees.length
    })).reverse();

    // Calculate average from the fetched records
    const avgAttendance = recentAttendance.length > 0
        ? Math.round(recentAttendance.reduce((acc, curr) => acc + curr.attendees.length, 0) / recentAttendance.length)
        : 0;

    // Upcoming Events
    const upcomingEventsCount = await Event.countDocuments({ date: { $gte: new Date() } });
    const nextEvent = await Event.findOne({ date: { $gte: new Date() } }).sort({ date: 1 });

    // Recent Activity (Newest members)
    const newMembers = await Member.find().sort({ createdAt: -1 }).limit(3);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Overview of your church's growth and activities.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Members</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{totalMembers}</div>
                    <p className="text-xs text-muted-foreground">Active Members</p>
                </div>
                <div className="p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Avg. Attendance</h3>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{avgAttendance}</div>
                    <p className="text-xs text-muted-foreground">Last {recentAttendance.length} Services</p>
                </div>
                <div className="p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Upcoming Events</h3>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{upcomingEventsCount}</div>
                    <p className="text-xs text-muted-foreground">
                        {nextEvent ? `Next: ${nextEvent.title}` : "No upcoming events"}
                    </p>
                </div>
                <div className="p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total People</h3>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{totalPeople}</div>
                    <p className="text-xs text-muted-foreground">Incl. Visitors</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-col space-y-1.5 p-6 pl-0 pt-0">
                        <h3 className="font-semibold leading-none tracking-tight">Attendance Overview</h3>
                        <p className="text-sm text-muted-foreground">Recent attendance trends.</p>
                    </div>
                    <div className="h-[200px] w-full">
                        <AttendanceChart data={chartData} />
                    </div>
                </div>
                <div className="col-span-3 p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-col space-y-1.5 p-6 pl-0 pt-0">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
                        <p className="text-sm text-muted-foreground">Latest member updates.</p>
                    </div>
                    <div className="space-y-4">
                        {newMembers.map((member) => (
                            <div key={member._id.toString()} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">New Member Added</p>
                                    <p className="text-sm text-muted-foreground">{member.firstName} {member.lastName} joined</p>
                                </div>
                                <div className="ml-auto font-medium text-sm text-muted-foreground">
                                    {new Date(member.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
