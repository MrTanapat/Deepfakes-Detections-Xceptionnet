"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";

// ─── page titles map ──────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/detect": "Detect",
  "/history": "History",
  "/admin": "Admin Panel",
};

// ─── topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Veridex";

  return (
    <header className="h-14 border-b border-slate-800/60 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* breadcrumb style */}
        <span className="text-slate-700 font-mono text-xs uppercase tracking-widest">
          Veridex
        </span>
        <span className="text-slate-800 font-mono text-xs">/</span>
        <span className="text-white font-mono text-xs uppercase tracking-widest">
          {title}
        </span>
      </div>

      {/* right: status indicator */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono text-slate-600 uppercase tracking-wider">
          System Online
        </span>
      </div>
    </header>
  );
}

// ─── layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, fetchMe } = useAuthStore();
  const router = useRouter();

  // Hydrate user from token on mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchMe();
  }, [isAuthenticated, fetchMe, router]);

  if (!isAuthenticated) return null;

  return (
    <div
      className="flex h-screen bg-[#060810] overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* sidebar */}
      <Sidebar />

      {/* main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />

        {/* page content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {/* subtle grid background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(6,188,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(6,188,212,0.03) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}