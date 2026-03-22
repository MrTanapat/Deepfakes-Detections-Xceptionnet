"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── tiny util ───────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(timer); }
        else setVal(start);
      }, 16);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── scan-line overlay ────────────────────────────────────────────────────────
function ScanLines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.8) 2px,rgba(255,255,255,0.8) 3px)", backgroundSize: "100% 3px" }} />
  );
}

// ─── nav ──────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-40 transition-all duration-500",
      scrolled ? "bg-[#060810]/90 backdrop-blur-xl border-b border-cyan-500/10 py-3" : "py-6")}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 border-2 border-cyan-400 rotate-45" />
            <div className="absolute inset-1.5 bg-cyan-400 rotate-45" />
          </div>
          <span className="font-mono text-white font-bold tracking-widest text-sm uppercase">
            Veridex
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-slate-400 uppercase">
          <a href="#how" className="hover:text-cyan-400 transition-colors">How it works</a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#stats" className="hover:text-cyan-400 transition-colors">Stats</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-xs font-mono tracking-wider text-slate-400 hover:text-white transition-colors uppercase px-4 py-2">
            Sign in
          </Link>
          <Link href="/register"
            className="text-xs font-mono tracking-wider bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase px-5 py-2 transition-colors">
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* background grid */}
      <div className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(rgba(6,188,212,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(6,188,212,0.05) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)" }} />

      {/* corner brackets */}
      <div className="absolute top-32 left-10 w-16 h-16 border-l-2 border-t-2 border-cyan-500/30" />
      <div className="absolute top-32 right-10 w-16 h-16 border-r-2 border-t-2 border-cyan-500/30" />
      <div className="absolute bottom-20 left-10 w-16 h-16 border-l-2 border-b-2 border-cyan-500/30" />
      <div className="absolute bottom-20 right-10 w-16 h-16 border-r-2 border-b-2 border-cyan-500/30" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* badge */}
        <div className="inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/5 px-4 py-1.5 mb-10"
          style={{ clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-[0.3em] text-cyan-400 uppercase">Powered by XceptionNet + Context Expansion</span>
        </div>

        {/* headline */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          DETECT<br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #22d3ee 0%, #67e8f9 50%, #a5f3fc 100%)" }}>
              THE FAKE.
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Advanced deepfake detection using deep learning. Upload a photo or video — 
          our AI analyzes facial artifacts invisible to the human eye.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/detect"
            className="group relative inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-sm uppercase tracking-widest px-8 py-4 transition-all duration-300">
            <span>Analyze Now</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 border border-cyan-300/0 group-hover:border-cyan-300/50 transition-all" />
          </Link>
          <a href="#how"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-mono text-sm uppercase tracking-widest transition-colors">
            <span>Learn more</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* floating file type badges */}
        <div className="mt-16 flex items-center justify-center gap-3 flex-wrap">
          {["MP4", "MOV", "AVI", "JPG", "PNG", "WEBP"].map((ext) => (
            <span key={ext} className="text-xs font-mono text-slate-500 border border-slate-700 px-3 py-1 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-default">
              .{ext}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── how it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: "01", title: "Upload Media", desc: "Drag & drop or select your image or video file. We support all major formats up to 500MB.", icon: "↑" },
    { num: "02", title: "AI Analysis", desc: "XceptionNet scans for facial artifacts using Context Expansion — capturing cues beyond just the face region.", icon: "⬡" },
    { num: "03", title: "Get Results", desc: "Receive a confidence score with a detailed breakdown of detected manipulation signals.", icon: "◈" },
  ];
  return (
    <section id="how" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <p className="font-mono text-xs tracking-[0.4em] text-cyan-500 uppercase mb-4">— Process</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            How It Works
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-slate-800/50">
          {steps.map((s, i) => (
            <div key={i} className="bg-[#060810] p-10 group hover:bg-slate-900/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/50 transition-all duration-500" />
              <div className="text-5xl font-black text-slate-800 font-mono mb-8 group-hover:text-slate-700 transition-colors select-none">
                {s.num}
              </div>
              <div className="text-2xl text-cyan-400 mb-4 font-mono">{s.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { val: 97, suffix: "%", label: "Detection Accuracy" },
    { val: 60000, suffix: "+", label: "Training Frames" },
    { val: 5, suffix: "", label: "Manipulation Methods" },
    { val: 299, suffix: "ms", label: "Avg. Response Time" },
  ];
  return (
    <section id="stats" className="py-24 border-y border-slate-800 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)" }} />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800/40">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#060810] px-8 py-12 text-center">
              <div className="text-4xl md:text-5xl font-black text-cyan-400 font-mono mb-2">
                <Counter target={s.val} suffix={s.suffix} />
              </div>
              <div className="text-xs font-mono tracking-widest text-slate-500 uppercase">{s.label}</div>
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
    { title: "Context Expansion", desc: "Unlike standard models, we analyze beyond the face boundary — hair, neck, and edge regions often reveal manipulation artifacts.", tag: "Core Tech" },
    { title: "Video Frame Analysis", desc: "For videos, we intelligently sample frames and aggregate predictions for a more robust and reliable result.", tag: "Video" },
    { title: "Face Detection First", desc: "RetinaFace locates and crops faces with 35% context margin before classification — ensuring clean, consistent input.", tag: "Pipeline" },
    { title: "Confidence Scoring", desc: "Get a percentage score alongside Real/Fake classification. Know exactly how confident the model is.", tag: "Output" },
    { title: "History Tracking", desc: "Every analysis is logged to your account. Review past detections, compare results, and export reports.", tag: "Account" },
    { title: "Admin Dashboard", desc: "Full admin panel to monitor system usage, manage users, and view aggregate detection statistics.", tag: "Admin" },
  ];
  return (
    <section id="features" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.4em] text-cyan-500 uppercase mb-4">— Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Built for Accuracy
            </h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Every component engineered for reliable, production-grade deepfake detection.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800/30">
          {features.map((f, i) => (
            <div key={i} className="group bg-[#060810] p-8 hover:bg-slate-900/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(6,182,212,0.05) 0%, transparent 60%)" }} />
              <span className="inline-block text-xs font-mono tracking-widest text-cyan-600 border border-cyan-900 px-2 py-0.5 mb-6 uppercase">{f.tag}</span>
              <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
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
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 border-y border-slate-800" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }} />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black text-white leading-none mb-6 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          TRUTH OR<br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#22d3ee,#67e8f9)" }}>
            DECEPTION?
          </span>
        </h2>
        <p className="text-slate-400 mb-12 max-w-xl mx-auto">Upload your media and find out in seconds. No account required for your first analysis.</p>
        <Link href="/detect"
          className="group inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-sm uppercase tracking-widest px-10 py-5 transition-all duration-300">
          <span>Start Detection</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

// ─── footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-slate-800/60 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 border-2 border-cyan-400/60 rotate-45" />
            <div className="absolute inset-1 bg-cyan-400/60 rotate-45" />
          </div>
          <span className="font-mono text-slate-500 text-xs tracking-widest uppercase">Veridex</span>
        </div>
        <p className="text-xs font-mono text-slate-700 tracking-widest uppercase">
          Deepfake Detection System — RMUTL Senior Project
        </p>
        <p className="text-xs font-mono text-slate-700">© 2025</p>
      </div>
    </footer>
  );
}

// ─── root ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#060810] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <ScanLines />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Stats />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}