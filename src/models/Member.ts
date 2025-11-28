import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMember extends Document {
    firstName: string;
    lastName: string;
    gender: "Male" | "Female";
    dob: string; // DD/MM
    phoneNumbers: string[];
    address: string;
    status: "Member" | "Inactive" | "Visitor";
    joinDate: Date;
    ministry?: string;
    occupation?: string;
    emergencyContact?: string;
    notes?: string;
    consecutiveAbsences: number;
    attendanceCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const MemberSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, enum: ["Male", "Female"], required: true },
        dob: { type: String, required: true }, // Validation logic can be added in API
        phoneNumbers: { type: [String], required: true },
        address: { type: String, required: true },
        status: {
            type: String,
            enum: ["Member", "Inactive", "Visitor"],
            default: "Visitor",
        },
        joinDate: { type: Date, default: Date.now },
        ministry: { type: String },
        occupation: { type: String },
        emergencyContact: { type: String },
        notes: { type: String },
        consecutiveAbsences: { type: Number, default: 0 },
        attendanceCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Prevent model recompilation error in Next.js hot reload
const Member: Model<IMember> =
    mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);

export default Member;
