"use client";

import Link from "next/link";

// Imports Conponents
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Homepages/Hero";
import Stats from "@/components/layout/Homepages/StatsTemp";
import HowItWorks from "@/components/layout/Homepages/HowItWorks";
import Features from "@/components/layout/Homepages/Features";
import Footer from "@/components/layout/Homepages/Footer";

// ─── divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="border-t border-gray-100" /></div>;
}

// ─── root ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <Divider />
      <Stats />
      <Divider />
      <HowItWorks />
      <Divider />
      <Features />
      <Footer />
    </main>
  );
}