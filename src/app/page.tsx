import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight">GraceGather</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20">
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
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/40 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Grace Gather. Built for the Kingdom.</p>
      </footer>
    </div>
  );
}
