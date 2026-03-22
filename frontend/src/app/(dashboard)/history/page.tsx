"use client";

import { useState, useEffect, useCallback } from "react";
import DetectService from "@/services/detect.service";
import type { Detection, DetectionLabel, MediaType, DetectionHistoryParams } from "@/types";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── label badge ─────────────────────────────────────────────────────────────

function LabelBadge({ label }: { label: DetectionLabel }) {
  const isFake = label === "fake";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 border ${
      isFake
        ? "border-red-500/40 bg-red-500/10 text-red-400"
        : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
    }`}>
      <span className={`w-1 h-1 rounded-full ${isFake ? "bg-red-400" : "bg-emerald-400"}`} />
      {label}
    </span>
  );
}

// ─── status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Detection["status"] }) {
  const map = {
    completed: "text-slate-400 border-slate-700",
    processing: "text-amber-400 border-amber-500/40",
    pending: "text-slate-500 border-slate-800",
    failed: "text-red-400 border-red-500/40",
  };
  return (
    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border ${map[status]}`}>
      {status}
    </span>
  );
}

// ─── filter bar ───────────────────────────────────────────────────────────────

function FilterBar({
  params,
  onChange,
}: {
  params: DetectionHistoryParams;
  onChange: (p: DetectionHistoryParams) => void;
}) {
  const btnBase = "text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 border transition-colors";
  const active = "border-cyan-500/50 text-cyan-400 bg-cyan-500/10";
  const inactive = "border-slate-800 text-slate-600 hover:border-slate-600 hover:text-slate-400";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* label filter */}
      <div className="flex items-center gap-1">
        {(["all", "fake", "real"] as const).map((l) => (
          <button
            key={l}
            onClick={() => onChange({ ...params, label: l === "all" ? undefined : l, page: 1 })}
            className={`${btnBase} ${(params.label ?? "all") === l ? active : inactive}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-slate-800" />

      {/* media type filter */}
      <div className="flex items-center gap-1">
        {(["all", "image", "video"] as const).map((m) => (
          <button
            key={m}
            onClick={() => onChange({ ...params, mediaType: m === "all" ? undefined : (m as MediaType), page: 1 })}
            className={`${btnBase} ${(params.mediaType ?? "all") === m ? active : inactive}`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── detection row ────────────────────────────────────────────────────────────

function DetectionRow({ d }: { d: Detection }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* file */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-slate-800 flex items-center justify-center shrink-0 text-slate-600">
              {d.mediaType === "video" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                  <path strokeLinecap="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono text-white truncate max-w-[180px]">{d.fileName}</p>
              <p className="text-[10px] font-mono text-slate-600">{formatBytes(d.fileSize)}</p>
            </div>
          </div>
        </td>

        {/* verdict */}
        <td className="px-4 py-3">
          {d.result ? <LabelBadge label={d.result.label} /> : <StatusBadge status={d.status} />}
        </td>

        {/* confidence */}
        <td className="px-4 py-3">
          {d.result ? (
            <div className="flex items-center gap-2">
              <div className="w-20 h-px bg-slate-800 relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${d.result.label === "fake" ? "bg-red-400" : "bg-emerald-400"}`}
                  style={{ width: `${Math.round(d.result.confidence * 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-400">
                {Math.round(d.result.confidence * 100)}%
              </span>
            </div>
          ) : (
            <span className="text-xs font-mono text-slate-700">—</span>
          )}
        </td>

        {/* date */}
        <td className="px-4 py-3">
          <span className="text-xs font-mono text-slate-500">{formatDate(d.createdAt)}</span>
        </td>

        {/* cached */}
        <td className="px-4 py-3">
          {d.cached && (
            <span className="text-[10px] font-mono text-amber-500 border border-amber-500/30 px-1.5 py-0.5">
              Cached
            </span>
          )}
        </td>

        {/* expand */}
        <td className="px-4 py-3">
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
          </svg>
        </td>
      </tr>

      {/* expanded detail */}
      {expanded && d.result && (
        <tr className="border-b border-slate-800/40">
          <td colSpan={6} className="px-4 py-4 bg-slate-900/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Method", value: d.result.methodDetected ?? "Unknown" },
                { label: "Frames", value: `${d.result.framesAnalyzed}` },
                { label: "Processing", value: `${d.result.processingTimeMs}ms` },
                { label: "File Hash", value: `${d.fileHash.slice(0, 16)}...` },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-xs font-mono text-slate-300">{item.value}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs font-mono text-slate-600">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="text-xs font-mono text-slate-500 hover:text-white disabled:opacity-30 border border-slate-800 hover:border-slate-600 px-3 py-1.5 transition-colors disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className="text-xs font-mono text-slate-500 hover:text-white disabled:opacity-30 border border-slate-800 hover:border-slate-600 px-3 py-1.5 transition-colors disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState<DetectionHistoryParams>({ page: 1, limit: 15 });

  const load = useCallback(async (p: DetectionHistoryParams) => {
    setLoading(true);
    try {
      const res = await DetectService.getHistory(p);
      setDetections(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      // handle silently — could add toast here
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(params); }, [params, load]);

  const handleParamChange = (p: DetectionHistoryParams) => {
    setParams(p);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* header */}
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-xs tracking-[0.4em] text-cyan-500 uppercase mb-3">— Records</p>
          <h1 className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {total.toLocaleString()} total detection{total !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/detect"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase tracking-widest px-5 py-3 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          New Detection
        </a>
      </div>

      {/* filters */}
      <div className="mb-6">
        <FilterBar params={params} onChange={handleParamChange} />
      </div>

      {/* table */}
      <div className="border border-slate-800/60 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-900/30">
              {["File", "Verdict", "Confidence", "Date", "", ""].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // skeleton rows
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-800/40">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 bg-slate-800/60 animate-pulse rounded-sm" style={{ width: `${60 + (j * 10) % 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : detections.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="text-slate-700 font-mono text-xs uppercase tracking-widest">
                    No detections found
                  </div>
                </td>
              </tr>
            ) : (
              detections.map((d) => <DetectionRow key={d.id} d={d} />)
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={params.page ?? 1}
        totalPages={totalPages}
        onPage={(p) => handleParamChange({ ...params, page: p })}
      />
    </div>
  );
}