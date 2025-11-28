import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const member = await Member.findById(id);
        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }
        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch member" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const member = await Member.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }
        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update member" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const member = await Member.findByIdAndDelete(id);
        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Member deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete member" },
            { status: 500 }
        );
    }
}
