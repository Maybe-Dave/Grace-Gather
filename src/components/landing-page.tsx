"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Users, CalendarCheck, CalendarDays, MessageSquare, Shield, BarChart3, Facebook, Twitter, Instagram, Linkedin, CheckCircle2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface LandingPageProps {
    session: any;
}

export default function LandingPage({ session }: LandingPageProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col" ref={targetRef}>
            {/* Animated Background Gradients */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -45, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"
            />

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
            >
                <div className="container mx-auto px-6 md:px-12 lg:px-24 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-8 h-8 relative"
                        >
                            <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
                        </motion.div>
                        <span className="font-bold text-xl tracking-tight">GraceGather</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        {session ? (
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                Go to App <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section
                style={{ opacity, scale, y }}
                className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24 pt-40 pb-32 min-h-screen"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-6 border border-secondary/20"
                >
                    <Sparkles className="w-3 h-3" />
                    <span>Next-Gen Church Management</span>
                </motion.div>

                <motion.h1
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 max-w-5xl"
                >
                    <motion.span variants={itemVariants} className="block">Gather, Grow, and</motion.span>
                    <motion.span variants={itemVariants} className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary">Grace Your Community</motion.span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
                >
                    Streamline attendance, manage members, and engage your congregation with a modern, AI-powered platform designed for growth.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 text-lg"
                        >
                            Go to Dashboard <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                    <Link href="/chat">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-secondary/10 text-secondary font-medium hover:bg-secondary/20 transition-all border border-secondary/20 text-lg"
                        >
                            Ask AI Assistant
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section className="py-32 bg-muted/30 relative">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything You Need to Thrive</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Powerful tools to help you manage your church operations efficiently, so you can focus on what matters most - your people.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "Member Management", desc: "Effortlessly manage member profiles, track growth, and keep your community database organized.", color: "text-primary", bg: "bg-primary/10" },
                            { icon: CalendarCheck, title: "Attendance Tracking", desc: "Track service attendance with ease. Get insights into trends and patterns.", color: "text-secondary", bg: "bg-secondary/10" },
                            { icon: CalendarDays, title: "Event Management", desc: "Plan and manage church events, services, and gatherings. Keep everyone informed.", color: "text-orange-500", bg: "bg-orange-500/10" },
                            { icon: MessageSquare, title: "AI Assistant", desc: "Leverage AI to draft communications, get insights, and answer questions instantly.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { icon: BarChart3, title: "Analytics & Insights", desc: "Visualize growth, attendance, and engagement metrics to make informed decisions.", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { icon: Shield, title: "Secure & Private", desc: "Your data is protected with enterprise-grade security. Role-based access ensures privacy.", color: "text-violet-500", bg: "bg-violet-500/10" },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-6 md:px-12 lg:px-24 relative text-center"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Transform Your Church?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                        Join thousands of churches using GraceGather to streamline operations and focus on ministry.
                    </p>
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 rounded-full bg-primary text-primary-foreground text-xl font-medium hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 inline-flex items-center gap-3"
                        >
                            Get Started Now <ArrowRight className="w-6 h-6" />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border pt-20 pb-10">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 relative">
                                    <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
                                </div>
                                <span className="font-bold text-xl tracking-tight">GraceGather</span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Empowering churches with modern tools to gather, grow, and grace their communities.
                            </p>
                        </div>

                        {[
                            { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
                            { title: "Resources", links: ["Documentation", "Blog", "Community", "Help Center"] },
                            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
                        ].map((col, idx) => (
                            <div key={idx}>
                                <h4 className="font-semibold mb-6">{col.title}</h4>
                                <ul className="space-y-4 text-sm text-muted-foreground">
                                    {col.links.map((link, i) => (
                                        <li key={i}>
                                            <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">
                                                <span className="w-0 group-hover:w-2 transition-all h-[1px] bg-primary"></span>
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} Grace Gather. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
