import { Users, CalendarCheck, CalendarDays, TrendingUp, Cake, UserPlus } from "lucide-react";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";
import Event from "@/models/Event";
import { AttendanceChart } from "@/components/attendance-chart";

interface ActivityItem {
    id: string;
    type: "new_member" | "birthday";
    title: string;
    description: string;
    date: Date;
}

export default async function DashboardPage() {
    await dbConnect();

    // Fetch counts
    const totalMembers = await Member.countDocuments({ status: { $ne: "Visitor" } });
    const totalVisitors = await Member.countDocuments({ status: "Visitor" });
    const totalPeople = await Member.countDocuments({});

    // Fetch recent attendance for chart and average
    const recentAttendance = await Attendance.find({ serviceType: "Sunday Service" }).sort({ date: -1 }).limit(6);
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

    // Recent Activity Logic
    const allMembers = await Member.find({}, 'firstName lastName dob createdAt');

    const activities: ActivityItem[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();

    // 1. New Members (Last 30 days)
    allMembers.forEach(member => {
        const joinDate = new Date(member.createdAt);
        if ((today.getTime() - joinDate.getTime()) / (1000 * 3600 * 24) <= 30) {
            activities.push({
                id: `join-${member._id}`,
                type: "new_member",
                title: "New Member Added",
                description: `${member.firstName} ${member.lastName} joined`,
                date: joinDate
            });
        }
    });

    // 2. Birthdays (Last 7 days and Next 14 days)
    allMembers.forEach(member => {
        if (!member.dob) return;

        const [day, month] = member.dob.split('/').map(Number);
        if (!day || !month) return;

        // Create date object for this year's birthday
        let birthdayDate = new Date(currentYear, month - 1, day);

        // Handle year wrap-around (e.g. looking at Jan birthdays in Dec)
        const diff = birthdayDate.getTime() - today.getTime();
        const daysDiff = diff / (1000 * 3600 * 24);

        // If birthday passed more than 7 days ago, check next year (maybe it's upcoming in Jan?)
        // Actually, for "Recent Activity", we care about:
        // - Recent past (e.g. last 7 days)
        // - Near future (e.g. next 14 days)

        // Simple check: is it within -7 to +14 days?
        if (daysDiff >= -7 && daysDiff <= 14) {
            activities.push({
                id: `bday-${member._id}`,
                type: "birthday",
                title: daysDiff < 0 ? "Recent Birthday" : (daysDiff < 1 ? "Birthday Today" : "Upcoming Birthday"),
                description: `${member.firstName} ${member.lastName}'s birthday`,
                date: birthdayDate
            });
        }
    });

    // Sort by date (newest/upcoming first)
    // For mixed list, maybe just sort by "relevance" or absolute date?
    // Let's sort by date descending (newest first)
    activities.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Limit to 5 items
    const recentActivity = activities.slice(0, 5);

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
                        <h3 className="tracking-tight text-sm font-medium">Avg. Sunday Attendance</h3>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{avgAttendance}</div>
                    <p className="text-xs text-muted-foreground">Last {recentAttendance.length} Sundays</p>
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
                        <p className="text-sm text-muted-foreground">Latest updates and birthdays.</p>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((item) => (
                                <div key={item.id} className="flex items-center">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${item.type === 'birthday' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {item.type === 'birthday' ? <Cake className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm text-muted-foreground">
                                        {item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
