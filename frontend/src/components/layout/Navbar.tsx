"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/language-provider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { key: "how", label: t("navbar.how") },
    { key: "features", label: t("navbar.features") },
    { key: "stats", label: t("navbar.stats") },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm",
        scrolled
          ? "bg-white/80 backdrop-blur-sm border-b border-gray-100 py-3 shadow-lg"
          : "py-6"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="group flex cursor-pointer items-center gap-3">
          <span className="text-xl font-bold uppercase tracking-widest text-gray-900">
            Lanner
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 text-md uppercase tracking-wider tracking-wide text-gray-900 md:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className="group relative transition-colors hover:text-emerald-500"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <Link
            href="/login"
            className="hidden px-4 py-2 text-md uppercase tracking-wider text-gray-900 transition hover:text-emerald-500 md:block"
          >
            {t("common.signIn")}
          </Link>

          <Link
            href="/register"
            className="group relative hidden overflow-hidden bg-emerald-500 rounded-md px-5 py-2 text-md font-bold uppercase tracking-wider text-black md:block"
          >
            <span className="relative z-10">{t("common.getStarted")}</span>
            <div className="absolute inset-0 bg-emerald-400 opacity-0 transition duration-300 group-hover:opacity-100" />
          </Link>

          {/* Mobile button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-900 md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 md:hidden",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-4 border-b border-t border-gray-100 bg-white/80 px-6 py-6 text-sm uppercase text-gray-900 shadow-lg backdrop-blur-md">
          <div className="pb-2">
            <LanguageSwitcher />
          </div>

          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              onClick={() => setMenuOpen(false)}
              className="block transition hover:text-emerald-500"
            >
              {item.label}
            </a>
          ))}

          <div className="flex flex-col gap-3 pt-4">
            <Link href="/login" className="border border-slate-600 py-2 text-center">
              {t("common.signIn")}
            </Link>

            <Link
              href="/register"
              className="bg-emerald-500 py-2 text-center font-bold text-black"
            >
              {t("common.getStarted")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}