import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttendance extends Document {
    date: Date;
    serviceType: string;
    attendees: mongoose.Types.ObjectId[]; // Array of Member IDs
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
    {
        date: { type: Date, required: true, default: Date.now },
        serviceType: { type: String, default: "Sunday Service" },
        attendees: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    },
    { timestamps: true }
);

const Attendance: Model<IAttendance> =
    mongoose.models.Attendance ||
    mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
