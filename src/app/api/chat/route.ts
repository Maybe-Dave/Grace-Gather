import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";
import Event from "@/models/Event";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
    try {
        const { message, role } = await request.json();

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: "Google API Key not configured" },
                { status: 500 }
            );
        }

        await dbConnect();

        // Context gathering based on Role (RBAC)
        let contextData = "";

        // Public/Viewer Context (Stats only)
        const memberCount = await Member.countDocuments();
        const eventCount = await Event.countDocuments();
        contextData += `Total Members: ${memberCount}. Upcoming Events: ${eventCount}. `;

        // Manager/Admin Context
        if (role === "Attendance Manager" || role === "Super Admin") {
            const recentAttendance = await Attendance.find().sort({ date: -1 }).limit(1).populate("attendees", "firstName lastName");
            contextData += `Recent Attendance: ${recentAttendance.length > 0 ? recentAttendance[0].attendees.length : 0} attendees. `;
        }

        if (role === "Member Manager" || role === "Super Admin") {
            // Potentially add more detailed member info if requested, but keep it safe for now
            // For this demo, we won't dump the whole DB into the context
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      You are a helpful assistant for the GraceGather Church Management System.
      User Role: ${role}
      Context Data: ${contextData}
      
      User Question: ${message}
      
      Answer the question based on the context provided. If the user asks for information not in the context or restricted for their role, politely decline.
      Keep answers concise and friendly.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
