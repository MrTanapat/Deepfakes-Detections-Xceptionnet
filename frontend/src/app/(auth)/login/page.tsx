"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── types ────────────────────────────────────────────────────────────────────
type Mode = "login" | "register";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

// ─── input component ──────────────────────────────────────────────────────────
function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <label className="block text-xs font-mono tracking-widest text-slate-500 uppercase mb-2">
        {label}
      </label>
      <div className={`relative border transition-all duration-300 ${
        error ? "border-red-500/60" :
        focused ? "border-cyan-500/70" : "border-slate-700/60"
      }`}>
        <div className={`absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 transition-colors duration-300 ${
          focused ? "border-cyan-400" : "border-slate-600"
        }`} />
        <div className={`absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 transition-colors duration-300 ${
          focused ? "border-cyan-400" : "border-slate-600"
        }`} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3.5 text-sm text-white font-mono placeholder-slate-700 outline-none"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-mono text-red-400">{error}</p>
      )}
    </div>
  );
}

// ─── submit button ────────────────────────────────────────────────────────────
function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-black disabled:text-slate-500 font-bold font-mono text-sm uppercase tracking-widest py-4 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : children}
      </span>
    </button>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const set = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.email.includes("@")) errs.email = "Invalid email address";
    if (form.password.length < 8) errs.password = "Minimum 8 characters";
    if (mode === "register") {
      if (!form.username.trim()) errs.username = "Username is required";
      if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: เชื่อมต่อ auth.service.ts
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#060810] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[520px] shrink-0 relative overflow-hidden border-r border-slate-800/60 p-12">
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(6,188,212,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(6,188,212,0.04) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)" }} />

        <Link href="/" className="relative flex items-center gap-3 group">
          <div className="w-9 h-9 relative">
            <div className="absolute inset-0 border-2 border-cyan-400 rotate-45 group-hover:rotate-[55deg] transition-transform duration-300" />
            <div className="absolute inset-2 bg-cyan-400 rotate-45 group-hover:rotate-[55deg] transition-transform duration-300" />
          </div>
          <span className="font-mono text-white font-bold tracking-widest text-sm uppercase">Veridex</span>
        </Link>

        <div className="relative flex items-center justify-center flex-1 py-16">
          {[180, 140, 100, 64].map((size, i) => (
            <div key={i} className="absolute rounded-full border border-cyan-500/10"
              style={{ width: size, height: size }} />
          ))}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-cyan-400/40 rotate-45" />
            <div className="absolute inset-3 border border-cyan-400/20 rotate-45" />
            <span className="font-mono text-cyan-400 text-2xl relative z-10">⬡</span>
          </div>
          <div className="absolute top-8 right-8 text-right">
            <div className="text-xs font-mono text-slate-600 mb-1">ACCURACY</div>
            <div className="text-2xl font-black font-mono text-cyan-400">97%</div>
          </div>
          <div className="absolute bottom-8 left-8">
            <div className="text-xs font-mono text-slate-600 mb-1">ENGINE</div>
            <div className="text-xs font-mono text-slate-400">XceptionNet</div>
            <div className="text-xs font-mono text-slate-600">+ Context Expansion</div>
          </div>
        </div>

        <div className="relative">
          <div className="w-8 h-px bg-cyan-500/40 mb-4" />
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            "The boundary between real and synthetic is no longer visible to the naked eye."
          </p>
          <p className="text-xs font-mono text-slate-700 mt-2 tracking-wider uppercase">Veridex Research, 2025</p>
        </div>
      </div>

      {/* ── right panel: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative">
        <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-slate-800" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-slate-800" />

        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 border-2 border-cyan-400 rotate-45" />
              <div className="absolute inset-1.5 bg-cyan-400 rotate-45" />
            </div>
            <span className="font-mono text-white font-bold tracking-widest text-sm uppercase">Veridex</span>
          </Link>

          <div className="flex border border-slate-800 mb-10 relative">
            <div
              className="absolute top-0 bottom-0 w-1/2 bg-slate-800/60 transition-transform duration-300"
              style={{ transform: mode === "register" ? "translateX(100%)" : "translateX(0)" }}
            />
            {(["login", "register"] as Mode[]).map((m) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`relative z-10 flex-1 py-3 text-xs font-mono tracking-widest uppercase transition-colors duration-300 ${
                  mode === m ? "text-white" : "text-slate-600 hover:text-slate-400"
                }`}>
                {m}
              </button>
            ))}
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              {mode === "login" ? "Welcome back." : "Create account."}
            </h1>
            <p className="text-sm text-slate-500">
              {mode === "login"
                ? "Sign in to access your detection history and dashboard."
                : "Join Veridex and start detecting deepfakes instantly."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <Input label="Username" value={form.username} onChange={set("username")}
                placeholder="your_username" error={errors.username} />
            )}
            <Input label="Email" type="email" value={form.email} onChange={set("email")}
              placeholder="you@example.com" error={errors.email} />
            <Input label="Password" type="password" value={form.password} onChange={set("password")}
              placeholder="••••••••" error={errors.password} />
            {mode === "register" && (
              <Input label="Confirm Password" type="password" value={form.confirmPassword}
                onChange={set("confirmPassword")} placeholder="••••••••" error={errors.confirmPassword} />
            )}
            {mode === "login" && (
              <div className="text-right">
                <a href="#" className="text-xs font-mono text-slate-600 hover:text-cyan-400 transition-colors tracking-wider uppercase">
                  Forgot password?
                </a>
              </div>
            )}
            <div className="pt-2">
              <SubmitButton loading={loading}>
                {mode === "login" ? (
                  <>
                    <span>Sign In</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </SubmitButton>
            </div>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs font-mono text-slate-700 tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <p className="text-center text-sm text-slate-600">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="text-cyan-400 hover:text-cyan-300 font-mono text-xs tracking-wider uppercase transition-colors"
            >
              {mode === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}