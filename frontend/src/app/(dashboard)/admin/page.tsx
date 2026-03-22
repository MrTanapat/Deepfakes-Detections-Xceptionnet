"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import type { SystemStats, User, AdminUsersParams, PaginatedResponse } from "@/types";

// ─── stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`border p-6 relative overflow-hidden ${accent ? "border-cyan-500/30 bg-cyan-500/5" : "border-slate-800/60 bg-slate-900/20"}`}>
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      )}
      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] mb-3">{label}</p>
      <p className={`text-3xl font-black font-mono ${accent ? "text-cyan-400" : "text-white"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs font-mono text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

// ─── user row ─────────────────────────────────────────────────────────────────

function UserRow({
  user,
  onRoleChange,
  onDelete,
}: {
  user: User;
  onRoleChange: (id: string, role: "user" | "admin") => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="border-b border-slate-800/40 hover:bg-slate-900/30 transition-colors">
      {/* avatar + name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border border-slate-800 bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              {user.username[0]}
            </span>
          </div>
          <div>
            <p className="text-xs font-mono text-white">{user.username}</p>
            <p className="text-[10px] font-mono text-slate-600">{user.email}</p>
          </div>
        </div>
      </td>

      {/* role */}
      <td className="px-4 py-3">
        <select
          value={user.role}
          onChange={(e) => onRoleChange(user.id, e.target.value as "user" | "admin")}
          className={`text-[10px] font-mono uppercase tracking-wider bg-transparent border px-2 py-1 outline-none cursor-pointer transition-colors ${
            user.role === "admin"
              ? "border-cyan-500/40 text-cyan-400"
              : "border-slate-700 text-slate-500 hover:border-slate-600"
          }`}
        >
          <option value="user" className="bg-slate-900">User</option>
          <option value="admin" className="bg-slate-900">Admin</option>
        </select>
      </td>

      {/* joined */}
      <td className="px-4 py-3">
        <span className="text-xs font-mono text-slate-600">
          {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            .format(new Date(user.createdAt))}
        </span>
      </td>

      {/* delete */}
      <td className="px-4 py-3">
        <button
          onClick={() => onDelete(user.id)}
          className="text-slate-700 hover:text-red-400 transition-colors"
          title="Delete user"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userParams, setUserParams] = useState<AdminUsersParams>({ page: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // fetch stats
  useEffect(() => {
    api.get<SystemStats>("/api/admin/stats")
      .then((r) => setStats(r.data))
      .finally(() => setLoadingStats(false));
  }, []);

  // fetch users
  const loadUsers = useCallback(async (p: AdminUsersParams) => {
    setLoadingUsers(true);
    try {
      const res = await api.get<PaginatedResponse<User>>("/api/admin/users", { params: p });
      setUsers(res.data.items);
      setUserTotal(res.data.total);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => { loadUsers(userParams); }, [userParams, loadUsers]);

  // search debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setUserParams((p) => ({ ...p, search: search || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleRoleChange = async (id: string, role: "user" | "admin") => {
    await api.patch(`/api/admin/users/${id}`, { role });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    await api.delete(`/api/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setUserTotal((t) => t - 1);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* header */}
      <div className="mb-10">
        <p className="font-mono text-xs tracking-[0.4em] text-cyan-500 uppercase mb-3">— Admin</p>
        <h1 className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          System Panel
        </h1>
      </div>

      {/* stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800/40 mb-10">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#060810] p-6">
              <div className="h-2 w-20 bg-slate-800 animate-pulse mb-4 rounded-sm" />
              <div className="h-8 w-24 bg-slate-800 animate-pulse rounded-sm" />
            </div>
          ))
        ) : stats ? (
          <>
            <StatCard label="Total Detections" value={stats.totalDetections} accent />
            <StatCard label="Fake Detected" value={stats.fakeDetected} sub={`${Math.round((stats.fakeDetected / stats.totalDetections) * 100)}% of total`} />
            <StatCard label="Real Verified" value={stats.realDetected} />
            <StatCard label="Cache Hit Rate" value={`${Math.round(stats.cacheHitRate * 100)}%`} sub={`Avg ${stats.avgProcessingTimeMs}ms`} />
          </>
        ) : null}
      </div>

      {/* users section */}
      <div>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Users
            <span className="text-slate-600 font-mono text-sm font-normal ml-3">{userTotal}</span>
          </h2>

          {/* search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
                <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-3-3" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-slate-900/40 border border-slate-800 text-xs font-mono text-white placeholder-slate-700 pl-8 pr-4 py-2 outline-none focus:border-cyan-500/50 transition-colors w-52"
            />
          </div>
        </div>

        <div className="border border-slate-800/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/30">
                {["User", "Role", "Joined", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800/40">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-slate-800/60 animate-pulse rounded-sm" style={{ width: `${50 + j * 15}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-xs font-mono text-slate-700 uppercase tracking-widest">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <UserRow key={u.id} user={u} onRoleChange={handleRoleChange} onDelete={handleDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {userTotal > (userParams.limit ?? 10) && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs font-mono text-slate-600">
              Page {userParams.page} of {Math.ceil(userTotal / (userParams.limit ?? 10))}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setUserParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                disabled={(userParams.page ?? 1) <= 1}
                className="text-xs font-mono text-slate-500 hover:text-white disabled:opacity-30 border border-slate-800 px-3 py-1.5 transition-colors disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <button
                onClick={() => setUserParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                disabled={(userParams.page ?? 1) >= Math.ceil(userTotal / (userParams.limit ?? 10))}
                className="text-xs font-mono text-slate-500 hover:text-white disabled:opacity-30 border border-slate-800 px-3 py-1.5 transition-colors disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}