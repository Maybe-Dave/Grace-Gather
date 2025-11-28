import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Attendance from "@/models/Attendance";

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
        return NextResponse.json(attendance, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create attendance record" },
            { status: 500 }
        );
    }
}
