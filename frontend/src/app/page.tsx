"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Conponents
import Navbar from "@/components/layout/Navbar";


// ─── navbar ───────────────────────────────────────────────────────────────────
<Navbar />

// ─── hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 px-3 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-600 tracking-wide">Powered by XceptionNet + Context Expansion</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Detect deepfakes<br />
            <span className="text-gray-400">with precision.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mb-10">
            Advanced deepfake detection using deep learning. Upload a photo or video — 
            our AI analyzes facial artifacts invisible to the human eye.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/detect"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm px-6 py-3 hover:bg-gray-700 transition-colors">
              Start Detection
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="#how"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 text-sm px-6 py-3 hover:bg-gray-50 transition-colors">
              Learn more
            </a>
          </div>

          {/* Supported formats */}
          <div className="flex flex-wrap gap-2 mt-8">
            {["JPG", "PNG", "WEBP", "MP4", "MOV", "AVI"].map((ext) => (
              <span key={ext} className="text-xs text-gray-400 border border-gray-200 px-2.5 py-1 bg-gray-50">
                .{ext}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="border-t border-gray-100" /></div>;
}

// ─── stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: "97%", label: "Detection Accuracy" },
    { value: "60K+", label: "Training Frames" },
    { value: "5", label: "Manipulation Methods" },
    { value: "<300ms", label: "Avg. Response Time" },
  ];

  return (
    <section id="stats" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {s.value}
              </div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── how it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload Media",
      desc: "Drag & drop or select your image or video file. We support all major formats up to 500MB.",
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "XceptionNet scans for facial artifacts using Context Expansion — capturing cues beyond just the face region.",
    },
    {
      num: "03",
      title: "Get Results",
      desc: "Receive a confidence score with a detailed breakdown of detected manipulation signals.",
    },
  ];

  return (
    <section id="how" className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            How it works
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
          {steps.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-gray-100 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {s.num}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { title: "Context Expansion", desc: "Analyzes beyond the face boundary — hair, neck, and edge regions often reveal manipulation artifacts.", tag: "Core Tech" },
    { title: "Video Frame Analysis", desc: "Intelligently samples frames and aggregates predictions for a robust, reliable result.", tag: "Video" },
    { title: "Face Detection First", desc: "RetinaFace locates and crops faces with 35% context margin before classification.", tag: "Pipeline" },
    { title: "Confidence Scoring", desc: "Get a percentage score alongside Real/Fake classification.", tag: "Output" },
    { title: "History Tracking", desc: "Every analysis is logged to your account. Review past detections and export reports.", tag: "Account" },
    { title: "Admin Dashboard", desc: "Full admin panel to monitor system usage, manage users, and view statistics.", tag: "Admin" },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Capabilities</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Built for accuracy
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 hover:bg-gray-50 transition-colors">
              <span className="inline-block text-xs text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-0.5 mb-5">
                {f.tag}
              </span>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── cta ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to verify your media?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8">
            Upload your media and find out in seconds. No account required for your first analysis.
          </p>
          <Link href="/detect"
            className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-medium px-6 py-3 hover:bg-gray-100 transition-colors">
            Start Detection
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">V</span>
          </div>
          <span className="text-sm text-gray-500">Veridex</span>
        </div>
        <p className="text-xs text-gray-400 text-center">
          Deepfake Detection System — RMUTL Senior Project
        </p>
        <p className="text-xs text-gray-400">© 2025</p>
      </div>
    </footer>
  );
}

// ─── root ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <Hero />
      <Divider />
      <Stats />
      <Divider />
      <HowItWorks />
      <Divider />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}