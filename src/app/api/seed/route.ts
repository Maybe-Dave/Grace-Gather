import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";
import Event from "@/models/Event";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await dbConnect();

        // 1. Create Admin User (if not exists)
        const adminEmail = "admin@gracegather.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                name: "Super Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "Super Admin",
            });
            console.log("Admin created");
        }

        // 1b. Create Manager User
        const managerEmail = "manager@gracegather.com";
        const existingManager = await User.findOne({ email: managerEmail });
        if (!existingManager) {
            const hashedPassword = await bcrypt.hash("manager123", 10);
            await User.create({
                name: "Member Manager",
                email: managerEmail,
                password: hashedPassword,
                role: "Member Manager",
            });
            console.log("Manager created");
        }

        // 1c. Create Viewer User
        const viewerEmail = "viewer@gracegather.com";
        const existingViewer = await User.findOne({ email: viewerEmail });
        if (!existingViewer) {
            const hashedPassword = await bcrypt.hash("viewer123", 10);
            await User.create({
                name: "Normal Member",
                email: viewerEmail,
                password: hashedPassword,
                role: "Viewer",
            });
            console.log("Viewer created");
        }

        // 2. Clear existing data (optional, but good for testing)
        // Comment out these lines if you want to append instead of replace
        await Member.deleteMany({});
        await Attendance.deleteMany({});
        await Event.deleteMany({});
        console.log("Existing data cleared");

        // 3. Generate 100 Members
        const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"];
        const ministries = ["Choir", "Ushering", "Media", "Children", "Youth", "Evangelism", "Prayer", "None"];
        const occupations = ["Teacher", "Engineer", "Nurse", "Doctor", "Accountant", "Student", "Business Owner", "Artist", "Driver", "Civil Servant", "Unemployed"];

        const members = [];
        for (let i = 0; i < 100; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const gender = Math.random() > 0.5 ? "Male" : "Female";
            const status = Math.random() > 0.8 ? "Visitor" : Math.random() > 0.9 ? "Inactive" : "Member";

            // Random DOB (18-70 years old)
            const age = Math.floor(Math.random() * 52) + 18;
            const dobYear = new Date().getFullYear() - age;
            const dobMonth = Math.floor(Math.random() * 12) + 1;
            const dobDay = Math.floor(Math.random() * 28) + 1;
            const dob = `${String(dobDay).padStart(2, "0")}/${String(dobMonth).padStart(2, "0")}`; // DD/MM format as per schema

            // Random Phone
            const phone = `0${Math.floor(Math.random() * 9000000000) + 1000000000}`;

            members.push({
                firstName,
                lastName,
                gender,
                dob,
                phoneNumbers: [phone],
                address: `${Math.floor(Math.random() * 100)} Main St, Lagos`,
                status,
                joinDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 2)), // Joined within last 2 years
                ministry: ministries[Math.floor(Math.random() * ministries.length)],
                occupation: occupations[Math.floor(Math.random() * occupations.length)],
                consecutiveAbsences: status === "Inactive" ? 5 : 0,
                attendanceCount: status === "Visitor" ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 50) + 5,
            });
        }

        const createdMembers = await Member.insertMany(members);
        console.log(`Created ${createdMembers.length} members`);

        // 4. Generate Past Attendance (Last 12 Sundays)
        const attendanceRecords = [];
        const today = new Date();
        // Find last Sunday
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 12; i++) {
            const date = new Date(lastSunday);
            date.setDate(date.getDate() - (i * 7));

            // Randomly select 70-90% of active members
            const activeMembers = createdMembers.filter(m => m.status === "Member" || m.status === "Visitor");
            const attendees = activeMembers
                .filter(() => Math.random() > 0.2)
                .map(m => m._id);

            attendanceRecords.push({
                date,
                serviceType: "Sunday Service",
                attendees,
            });
        }
        await Attendance.insertMany(attendanceRecords);
        console.log(`Created ${attendanceRecords.length} attendance records`);

        // 5. Generate Events
        const events = [
            {
                title: "Sunday Service",
                date: new Date(today.getTime() + 1000 * 60 * 60 * 24 * (7 - today.getDay())), // Next Sunday
                type: "Service",
                description: "Weekly Sunday Service",
            },
            {
                title: "Midweek Service",
                date: new Date(today.getTime() + 1000 * 60 * 60 * 24 * (3 - today.getDay() + 7)), // Next Wednesday
                type: "Service",
                description: "Bible Study and Prayer",
            },
            {
                title: "Youth Meeting",
                date: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 14), // 2 weeks from now
                type: "Meeting",
                description: "Monthly Youth Gathering",
            },
            {
                title: "Church Anniversary",
                date: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 30), // 1 month from now
                type: "Other",
                description: "Celebrating 10 years of Grace",
            }
        ];
        await Event.insertMany(events);
        console.log(`Created ${events.length} events`);

        return NextResponse.json({
            message: "Database seeded successfully",
            stats: {
                members: createdMembers.length,
                attendance: attendanceRecords.length,
                events: events.length
            }
        });

    } catch (error: any) {
        console.error("Seed Error:", error);
        return NextResponse.json(
            { error: "Failed to seed database", details: error.message },
            { status: 500 }
        );
    }
}
