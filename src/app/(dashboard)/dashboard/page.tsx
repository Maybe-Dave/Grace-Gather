import { Users, CalendarCheck, CalendarDays, TrendingUp } from "lucide-react";

export default function DashboardPage() {
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
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </div>
                <div className="p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Avg. Attendance</h3>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">850</div>
                    <p className="text-xs text-muted-foreground">+180 since last month</p>
                </div>
                <div className="p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Upcoming Events</h3>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Next: Sunday Service</p>
                </div>
                <div className="p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Growth Rate</h3>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+12%</div>
                    <p className="text-xs text-muted-foreground">+2% from last month</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-col space-y-1.5 p-6 pl-0 pt-0">
                        <h3 className="font-semibold leading-none tracking-tight">Attendance Overview</h3>
                        <p className="text-sm text-muted-foreground">Monthly attendance trends.</p>
                    </div>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted/20 rounded-lg">
                        Chart Placeholder
                    </div>
                </div>
                <div className="col-span-3 p-6 rounded-xl bg-card text-card-foreground shadow-md">
                    <div className="flex flex-col space-y-1.5 p-6 pl-0 pt-0">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
                        <p className="text-sm text-muted-foreground">Latest member updates.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">New Member Added</p>
                                <p className="text-sm text-muted-foreground">John Doe joined today</p>
                            </div>
                            <div className="ml-auto font-medium text-sm text-muted-foreground">2m ago</div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Attendance Marked</p>
                                <p className="text-sm text-muted-foreground">Sunday Service completed</p>
                            </div>
                            <div className="ml-auto font-medium text-sm text-muted-foreground">1h ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
