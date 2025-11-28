import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";

export async function GET() {
    try {
        await dbConnect();
        const members = await Member.find({}).sort({ lastName: 1 });
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch members" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const member = await Member.create(body);
        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create member" },
            { status: 500 }
        );
    }
}
