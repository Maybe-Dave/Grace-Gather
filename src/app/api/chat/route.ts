import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";
import Event from "@/models/Event";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
    try {
        const { message, history, role } = await request.json();

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

            if (recentAttendance.length > 0) {
                const attendeesList = recentAttendance[0].attendees.map((a: any) => `${a.firstName} ${a.lastName}`).join(", ");
                contextData += `Recent Attendance (${new Date(recentAttendance[0].date).toLocaleDateString()}): ${recentAttendance[0].attendees.length} attendees. Attendees List: ${attendeesList}. `;
            } else {
                contextData += `Recent Attendance: 0 attendees. `;
            }
        }

        if (role === "Member Manager" || role === "Super Admin") {
            const members = await Member.find({}, "firstName lastName phoneNumbers address status");
            const memberList = members.map(m =>
                `${m.firstName} ${m.lastName} (Status: ${m.status}, Phone: ${m.phoneNumbers.join(", ")}, Address: ${m.address})`
            ).join("; ");
            contextData += `Member Directory: ${memberList}. `;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Format history for the prompt
        const historyText = history ? history.map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n") : "";

        const prompt = `
      You are a helpful assistant for the GraceGather Church Management System.
      User Role: ${role}
      
      Context Data:
      ${contextData}
      
      Conversation History:
      ${historyText}
      
      User Question: ${message}
      
      Instructions:
      1. Answer the question based on the context provided and the conversation history.
      2. If the user is a "Super Admin" or "Member Manager", you ARE AUTHORIZED to provide personal contact information (phone numbers, addresses) from the Member Directory.
      3. If the user is NOT authorized, politely decline to provide personal information.
      4. Keep answers concise and friendly.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error: any) {
        console.error("Chatbot Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}
