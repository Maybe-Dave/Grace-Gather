import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Users, CalendarCheck, CalendarDays, MessageSquare, Shield, BarChart3, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
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
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-24 pt-52 pb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-6 border border-secondary/20">
          <Sparkles className="w-3 h-3" />
          <span>Next-Gen Church Management</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
          Gather, Grow, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Grace</span> Your Community
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Streamline attendance, manage members, and engage your congregation with a modern, AI-powered platform designed for growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/chat"
            className="px-8 py-3 rounded-full bg-secondary/10 text-secondary font-medium hover:bg-secondary/20 transition-all border border-secondary/20"
          >
            Ask AI Assistant
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Thrive</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to help you manage your church operations efficiently, so you can focus on what matters most - your people.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Member Management</h3>
              <p className="text-muted-foreground text-sm">
                Effortlessly manage member profiles, track growth, and keep your community database organized and up-to-date.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Track service attendance with ease. Get insights into trends and patterns to better understand your congregation's engagement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Management</h3>
              <p className="text-muted-foreground text-sm">
                Plan and manage church events, services, and gatherings. Keep everyone informed and organized.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-muted-foreground text-sm">
                Leverage AI to draft communications, get insights, and answer questions about your church data instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-muted-foreground text-sm">
                Visualize growth, attendance, and engagement metrics to make informed decisions for your ministry.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                Your data is protected with enterprise-grade security. Role-based access ensures sensitive information stays private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Church Management?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of churches using GraceGather to streamline operations and focus on ministry.
          </p>
          <Link
            href="/dashboard"
            className="px-10 py-4 rounded-full bg-primary text-primary-foreground text-lg font-medium hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-2"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-16 pb-8">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 relative">
                  <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-xl tracking-tight">GraceGather</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering churches with modern tools to gather, grow, and grace their communities.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Grace Gather. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
