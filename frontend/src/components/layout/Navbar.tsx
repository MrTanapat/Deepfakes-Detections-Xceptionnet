"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm",
        scrolled
          ? "bg-white/80 backdrop-blur-sm border-b border-gray-100 py-3 shadow-lg"
          : "py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 border-2 border-emerald-500 rotate-45 group-hover:rotate-[60deg] transition-transform duration-300" />
            <div className="absolute inset-1.5 bg-emerald-500 rotate-45" />
          </div>
          <span className="font-mono text-gray-900 font-bold tracking-widest text-sm uppercase">
            Lanner
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-gray-900 uppercase">
          {["how", "features", "stats"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="relative hover:text-emerald-500 transition-colors group"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <Link
            href="/login"
            className="hidden md:block text-xs font-mono tracking-wider text-gray-900 hover:text-emerald-500 transition uppercase px-4 py-2"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="hidden md:block relative text-xs font-mono tracking-wider bg-emerald-500 text-black font-bold uppercase px-5 py-2 overflow-hidden group"
          >
            <span className="relative z-10">Get started</span>
            <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-100 transition duration-300" />
          </Link>

          {/* Mobile button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-900 p-2"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-500",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-white/80 backdrop-blur-md border-b shadow-lg border-gray-100 border-t px-6 py-6 space-y-4 font-mono text-sm uppercase text-gray-900">

          {["how", "features", "stats"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setMenuOpen(false)}
              className="block hover:text-emerald-500 transition"
            >
              {item}
            </a>
          ))}

          <div className="pt-4 flex flex-col gap-3">
            <Link href="/login" className="text-center border border-slate-600 py-2">
              Sign in
            </Link>

            <Link href="/register" className="text-center bg-emerald-500 text-black py-2 font-bold">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}