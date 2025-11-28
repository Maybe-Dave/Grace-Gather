import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
import * as XLSX from "xlsx";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        await dbConnect();

        const membersToInsert = [];
        const errors = [];

        for (const row of jsonData as any[]) {
            // Map Excel columns to Schema
            // Expected headers: "First Name", "Last Name", "Date of Birth", "Home Address", "Phone Number", "Status", "Gender"

            try {
                const firstName = row["First Name"];
                const lastName = row["Last Name"];
                const dob = row["Date of Birth"]; // Assuming DD/MM format string or Excel date
                const address = row["Home Address"];
                const phone = row["Phone Number"];
                const status = row["Status"] || "Visitor";
                const gender = row["Gender"];

                if (!firstName || !lastName || !phone) {
                    continue; // Skip invalid rows
                }

                // Basic validation/formatting could go here

                membersToInsert.push({
                    firstName,
                    lastName,
                    dob: dob || "01/01", // Default if missing
                    address: address || "Unknown",
                    phoneNumbers: [String(phone)],
                    status,
                    gender: gender || "Male", // Default
                    joinDate: new Date(),
                });
            } catch (e) {
                errors.push(e);
            }
        }

        if (membersToInsert.length > 0) {
            await Member.insertMany(membersToInsert);
        }

        return NextResponse.json({
            message: `Imported ${membersToInsert.length} members successfully.`,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to process file" },
            { status: 500 }
        );
    }
}
