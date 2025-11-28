import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
    title: string;
    date: Date;
    type: "Service" | "Birthday" | "Meeting" | "Other";
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        type: {
            type: String,
            enum: ["Service", "Birthday", "Meeting", "Other"],
            default: "Service",
        },
        description: { type: String },
    },
    { timestamps: true }
);

const Event: Model<IEvent> =
    mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
