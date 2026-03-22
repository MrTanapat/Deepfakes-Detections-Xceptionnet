"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

// ─── nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/detect",
    label: "Detect",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M11 8v3l2 2M21 21l-3-3" />
      </svg>
    ),
    badge: "NEW",
  },
  {
    href: "/history",
    label: "History",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
] as const;

const ADMIN_ITEMS = [
  {
    href: "/admin",
    label: "Admin Panel",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
] as const;

// ─── nav link ─────────────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  icon,
  badge,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 px-3 py-2.5 transition-all duration-200 ${
        isActive
          ? "text-white bg-cyan-500/10 border-l-2 border-cyan-400"
          : "text-slate-500 hover:text-slate-300 border-l-2 border-transparent hover:border-slate-700"
      }`}
    >
      {/* active glow */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
      )}

      <span className={`relative shrink-0 transition-colors ${isActive ? "text-cyan-400" : "group-hover:text-slate-300"}`}>
        {icon}
      </span>

      {!collapsed && (
        <>
          <span className="relative text-xs font-mono tracking-wider uppercase flex-1">{label}</span>
          {badge && (
            <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5">
              {badge}
            </span>
          )}
        </>
      )}

      {/* tooltip on collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 border border-slate-700 text-xs font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
          {label}
        </div>
      )}
    </Link>
  );
}

// ─── sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={`relative flex flex-col bg-[#060810] border-r border-slate-800/60 transition-all duration-300 ${
        collapsed ? "w-[60px]" : "w-[220px]"
      }`}
    >
      {/* top: logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800/60 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-7 h-7 relative shrink-0">
          <div className="absolute inset-0 border-2 border-cyan-400 rotate-45" />
          <div className="absolute inset-1.5 bg-cyan-400 rotate-45" />
        </div>
        {!collapsed && (
          <span className="font-mono text-white font-bold tracking-widest text-xs uppercase">
            Veridex
          </span>
        )}
      </div>

      {/* nav */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} collapsed={collapsed} />
          ))}
        </div>

        {/* admin section */}
        {user?.role === "admin" && (
          <>
            <div className={`mt-6 mb-2 px-3 ${collapsed ? "hidden" : ""}`}>
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-700 uppercase">
                Admin
              </span>
            </div>
            <div className="space-y-0.5">
              {ADMIN_ITEMS.map((item) => (
                <NavLink key={item.href} {...item} collapsed={collapsed} />
              ))}
            </div>
          </>
        )}
      </nav>

      {/* bottom: user + logout */}
      <div className="border-t border-slate-800/60 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            {/* avatar */}
            <div className="w-8 h-8 shrink-0 bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                {user?.username?.[0] ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-white truncate">{user?.username ?? "User"}</p>
              <p className="text-[10px] font-mono text-slate-600 truncate">{user?.role}</p>
            </div>
            <button
              onClick={() => logout()}
              className="shrink-0 text-slate-600 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => logout()}
            className="w-full flex justify-center text-slate-600 hover:text-red-400 transition-colors py-1"
            title="Logout"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>

      {/* collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-8 w-6 h-6 bg-slate-800 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all z-10"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`w-3 h-3 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
}