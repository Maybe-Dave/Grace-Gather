import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await dbConnect();

        const adminEmail = "admin@gracegather.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            return NextResponse.json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = await User.create({
            name: "Super Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "Super Admin",
        });

        return NextResponse.json({ message: "Admin created successfully", admin });
    } catch (error: any) {
        console.error("Seed Error:", error);
        return NextResponse.json(
            { error: "Failed to seed admin", details: error.message },
            { status: 500 }
        );
    }
}
