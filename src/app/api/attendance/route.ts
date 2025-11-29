import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Attendance from "@/models/Attendance";
import Member from "@/models/Member";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");

        let query = {};
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query = { date: { $gte: startDate, $lte: endDate } };
        }

        const records = await Attendance.find(query)
            .populate("attendees", "firstName lastName")
            .sort({ date: -1 });
        return NextResponse.json(records);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch attendance records" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const attendance = await Attendance.create(body);

        const { attendees } = body;

        // 1. Present Members: Increment attendance count, reset consecutive absences
        if (attendees && attendees.length > 0) {
            await Member.updateMany(
                { _id: { $in: attendees } },
                {
                    $inc: { attendanceCount: 1 },
                    $set: { consecutiveAbsences: 0 }
                }
            );
        }

        // 2. Absent Members: Increment consecutive absences (Only for those with status "Member")
        // We exclude the present attendees from the update
        await Member.updateMany(
            {
                _id: { $nin: attendees || [] },
                status: "Member"
            },
            {
                $inc: { consecutiveAbsences: 1 }
            }
        );

        return NextResponse.json(attendance, { status: 201 });
    } catch (error) {
        console.error("Attendance creation error:", error);
        return NextResponse.json(
            { error: "Failed to create attendance record" },
            { status: 500 }
        );
    }
}
