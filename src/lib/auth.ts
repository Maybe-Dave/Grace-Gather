import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Authorize called with email:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    console.log("Connecting to DB...");
                    await dbConnect();
                    console.log("DB Connected");

                    console.log("Finding user...");
                    const user = await User.findOne({ email: credentials.email }).select("+password");
                    console.log("User found:", user ? "Yes" : "No");

                    if (!user || !user.password) {
                        console.log("User not found or no password");
                        return null;
                    }

                    console.log("Comparing password...");
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    console.log("Password valid:", isValid);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
