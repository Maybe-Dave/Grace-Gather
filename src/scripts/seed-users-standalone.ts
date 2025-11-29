import dbConnect from "../lib/db";
import User from "../models/User";
import bcrypt from "bcryptjs";


async function seedUsers() {
    try {
        await dbConnect();
        console.log("Connected to DB");

        // Manager
        const managerEmail = "manager@gracegather.com";
        const existingManager = await User.findOne({ email: managerEmail });
        if (!existingManager) {
            const hashedPassword = await bcrypt.hash("manager123", 10);
            await User.create({
                name: "Member Manager",
                email: managerEmail,
                password: hashedPassword,
                role: "Member Manager",
            });
            console.log("Manager created");
        } else {
            console.log("Manager already exists");
        }

        // Viewer
        const viewerEmail = "viewer@gracegather.com";
        const existingViewer = await User.findOne({ email: viewerEmail });
        if (!existingViewer) {
            const hashedPassword = await bcrypt.hash("viewer123", 10);
            await User.create({
                name: "Normal Member",
                email: viewerEmail,
                password: hashedPassword,
                role: "Viewer",
            });
            console.log("Viewer created");
        } else {
            console.log("Viewer already exists");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
}

seedUsers();
