"use client";

import { useState, useRef, useCallback } from "react";
import DetectService from "@/services/detect.service";
import type { UploadDetectResponse, DetectionLabel, MediaType } from "@/types";

// ─── constants ────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "video/avi"];
const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

// ─── types ────────────────────────────────────────────────────────────────────

type PageState = "idle" | "uploading" | "analyzing" | "done" | "error";

interface FileInfo {
  file: File;
  preview: string | null;
  mediaType: MediaType;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMediaType(file: File): MediaType {
  return file.type.startsWith("video/") ? "video" : "image";
}

// ─── upload zone ──────────────────────────────────────────────────────────────

function UploadZone({
  onFile,
  disabled,
}: {
  onFile: (file: File) => void;
  disabled: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [disabled, onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative cursor-pointer border-2 border-dashed transition-all duration-300 p-16 flex flex-col items-center justify-center text-center select-none
        ${dragging
          ? "border-cyan-400 bg-cyan-500/5"
          : disabled
          ? "border-slate-800 cursor-not-allowed opacity-50"
          : "border-slate-700 hover:border-cyan-500/50 hover:bg-slate-900/40"
        }`}
    >
      {/* corner brackets */}
      <div className={`absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 transition-colors duration-300 ${dragging ? "border-cyan-400" : "border-slate-700"}`} />
      <div className={`absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 transition-colors duration-300 ${dragging ? "border-cyan-400" : "border-slate-700"}`} />
      <div className={`absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 transition-colors duration-300 ${dragging ? "border-cyan-400" : "border-slate-700"}`} />
      <div className={`absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 transition-colors duration-300 ${dragging ? "border-cyan-400" : "border-slate-700"}`} />

      {/* icon */}
      <div className={`w-16 h-16 border-2 flex items-center justify-center mb-6 transition-colors duration-300 ${dragging ? "border-cyan-400 text-cyan-400" : "border-slate-700 text-slate-600"}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
          <path strokeLinecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      <p className="text-white font-mono text-sm mb-2 uppercase tracking-widest">
        {dragging ? "Drop to analyze" : "Drag & drop your file"}
      </p>
      <p className="text-slate-600 text-xs font-mono mb-6">or click to browse</p>

      {/* supported formats */}
      <div className="flex flex-wrap justify-center gap-2">
        {["JPG", "PNG", "WEBP", "MP4", "MOV", "AVI"].map((ext) => (
          <span key={ext} className="text-[10px] font-mono text-slate-700 border border-slate-800 px-2 py-0.5 uppercase">
            .{ext}
          </span>
        ))}
      </div>
      <p className="text-slate-700 text-[11px] font-mono mt-3">Max 500MB</p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

// ─── file preview card ────────────────────────────────────────────────────────

function FilePreview({
  info,
  onClear,
  forceReanalyze,
  onToggleForce,
}: {
  info: FileInfo;
  onClear: () => void;
  forceReanalyze: boolean;
  onToggleForce: () => void;
}) {
  return (
    <div className="border border-slate-800 bg-slate-900/30 p-4 flex items-center gap-4">
      {/* thumbnail */}
      <div className="w-14 h-14 shrink-0 border border-slate-800 overflow-hidden bg-slate-900 flex items-center justify-center">
        {info.preview ? (
          <img src={info.preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-slate-600">
            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        )}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-mono truncate">{info.file.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase border border-slate-800 px-1.5 py-0.5">
            {info.mediaType}
          </span>
          <span className="text-[10px] font-mono text-slate-600">{formatBytes(info.file.size)}</span>
        </div>
      </div>

      {/* force re-analyze toggle */}
      <button
        onClick={onToggleForce}
        className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 border transition-colors ${
          forceReanalyze
            ? "border-amber-500/50 text-amber-400 bg-amber-500/10"
            : "border-slate-700 text-slate-600 hover:border-slate-600 hover:text-slate-400"
        }`}
        title="Force re-analyze even if cached"
      >
        Force
      </button>

      {/* clear */}
      <button onClick={onClear} className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-mono text-cyan-400">{percent}%</span>
      </div>
      <div className="h-px bg-slate-800 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
        {/* shimmer */}
        <div
          className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent animate-pulse"
          style={{ left: `${percent - 10}%` }}
        />
      </div>
    </div>
  );
}

// ─── result card ──────────────────────────────────────────────────────────────

function ResultCard({
  result,
  cached,
  onReset,
}: {
  result: UploadDetectResponse;
  cached: boolean;
  onReset: () => void;
}) {
  const { label, confidence, framesAnalyzed, processingTimeMs, methodDetected } =
    result.result!;

  const isFake = label === "fake" as DetectionLabel;
  const pct = Math.round(confidence * 100);

  return (
    <div className={`relative border overflow-hidden ${isFake ? "border-red-500/30" : "border-emerald-500/30"}`}>
      {/* top color bar */}
      <div className={`h-1 w-full ${isFake ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400"}`} />

      {/* glow */}
      <div className={`absolute inset-0 pointer-events-none ${isFake ? "bg-red-500/3" : "bg-emerald-500/3"}`} />

      <div className="p-8 relative">
        {/* verdict */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-2">
              Verdict
            </p>
            <h2
              className={`text-5xl font-black tracking-tight ${isFake ? "text-red-400" : "text-emerald-400"}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {isFake ? "FAKE" : "REAL"}
            </h2>
          </div>

          {cached && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-1">
              Cached Result
            </span>
          )}
        </div>

        {/* confidence gauge */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Confidence</span>
            <span className={`text-sm font-mono font-bold ${isFake ? "text-red-400" : "text-emerald-400"}`}>
              {pct}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 relative overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isFake ? "bg-gradient-to-r from-red-700 to-red-400" : "bg-gradient-to-r from-emerald-700 to-emerald-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-mono text-slate-700">0%</span>
            <span className="text-[10px] font-mono text-slate-700">100%</span>
          </div>
        </div>

        {/* meta grid */}
        <div className="grid grid-cols-2 gap-px bg-slate-800/50 mb-8">
          {[
            { label: "Method Detected", value: methodDetected ?? "N/A" },
            { label: "Frames Analyzed", value: framesAnalyzed > 0 ? `${framesAnalyzed} frames` : "1 frame" },
            { label: "Processing Time", value: `${processingTimeMs}ms` },
            { label: "Media Type", value: framesAnalyzed > 1 ? "Video" : "Image" },
          ].map((item) => (
            <div key={item.label} className="bg-[#060810] px-4 py-3">
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-sm font-mono text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-widest py-3 transition-all"
          >
            Analyze Another
          </button>
          <button
            className="flex-1 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-mono text-xs uppercase tracking-widest py-3 transition-all"
            onClick={() => window.location.href = "/history"}
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── error banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="border border-red-500/30 bg-red-500/5 px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
        <p className="text-sm font-mono text-red-400">{message}</p>
      </div>
      <button onClick={onDismiss} className="text-red-600 hover:text-red-400 transition-colors shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function DetectPage() {
  const [state, setState] = useState<PageState>("idle");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [forceReanalyze, setForceReanalyze] = useState(false);
  const [result, setResult] = useState<UploadDetectResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFile = useCallback((file: File) => {
    // validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg("Unsupported file type. Please upload JPG, PNG, WEBP, MP4, MOV, or AVI.");
      return;
    }
    // validate size
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg("File exceeds 500MB limit.");
      return;
    }

    setErrorMsg("");
    const mediaType = getMediaType(file);
    const preview = mediaType === "image" ? URL.createObjectURL(file) : null;
    setFileInfo({ file, preview, mediaType });
    setResult(null);
    setState("idle");
  }, []);

  const handleClear = () => {
    if (fileInfo?.preview) URL.revokeObjectURL(fileInfo.preview);
    setFileInfo(null);
    setResult(null);
    setUploadProgress(0);
    setErrorMsg("");
    setState("idle");
  };

  const handleAnalyze = async () => {
    if (!fileInfo) return;

    setState("uploading");
    setUploadProgress(0);
    setErrorMsg("");

    try {
      const res = await DetectService.upload(
        fileInfo.file,
        forceReanalyze,
        (pct) => {
          setUploadProgress(pct);
          if (pct === 100) setState("analyzing");
        }
      );
      setResult(res);
      setState("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Detection failed. Please try again.";
      setErrorMsg(msg);
      setState("error");
    }
  };

  const isProcessing = state === "uploading" || state === "analyzing";

  return (
    <div className="max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* header */}
      <div className="mb-10">
        <p className="font-mono text-xs tracking-[0.4em] text-cyan-500 uppercase mb-3">— Detection</p>
        <h1
          className="text-4xl font-black text-white tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Analyze Media
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Upload an image or video to detect deepfake manipulation.
        </p>
      </div>

      <div className="space-y-4">
        {/* error banner */}
        {errorMsg && (
          <ErrorBanner message={errorMsg} onDismiss={() => setErrorMsg("")} />
        )}

        {/* upload zone — hide when done */}
        {state !== "done" && (
          <>
            <UploadZone onFile={handleFile} disabled={isProcessing} />

            {/* file preview */}
            {fileInfo && (
              <FilePreview
                info={fileInfo}
                onClear={handleClear}
                forceReanalyze={forceReanalyze}
                onToggleForce={() => setForceReanalyze((f) => !f)}
              />
            )}

            {/* progress */}
            {state === "uploading" && (
              <ProgressBar percent={uploadProgress} label="Uploading" />
            )}
            {state === "analyzing" && (
              <ProgressBar percent={100} label="Analyzing — XceptionNet processing..." />
            )}

            {/* analyze button */}
            {fileInfo && !isProcessing && (
              <button
                onClick={handleAnalyze}
                className="group w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-sm uppercase tracking-widest py-4 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="M21 21l-3-3" />
                  </svg>
                  Start Detection
                </span>
              </button>
            )}
          </>
        )}

        {/* result */}
        {state === "done" && result?.result && (
          <ResultCard
            result={result}
            cached={result.cached}
            onReset={handleClear}
          />
        )}
      </div>
    </div>
  );
}