import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: "Super Admin" | "Attendance Manager" | "Member Manager" | "Viewer";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false }, // Password optional for OAuth, but required for Credentials
        role: {
            type: String,
            enum: ["Super Admin", "Attendance Manager", "Member Manager", "Viewer"],
            default: "Viewer",
        },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
