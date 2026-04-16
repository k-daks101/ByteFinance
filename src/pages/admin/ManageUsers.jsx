import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Users, RefreshCw, Search } from "lucide-react";

const fmt = (n, d = 2) =>
  Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function ManageUsers() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch]     = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const data = await api.get("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err?.message || "Unable to load users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (user) => {
    setError("");
    setTogglingId(user.id);
    try {
      const res = await api.put(`/admin/users/${user.id}/status`, {});
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, is_disabled: res.is_disabled } : u)
      );
    } catch (err) {
      setError(err?.message || "Unable to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      search.trim() === "" ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between bf-card px-6 py-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
            <p className="text-sm text-slate-500">View, enable, or disable user accounts.</p>
          </div>
        </div>
        <button
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="bf-btn-interactive flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full max-w-sm rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      <section className="bf-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">User List</h2>
          <span className="text-xs text-slate-400">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading users…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-right">Balance</th>
                  <th className="px-6 py-3 text-right">Trades</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                          {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-700">
                      Ⓥ {fmt(user.virtual_balance)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {user.trades_count ?? 0}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{fmtDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">Admin</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">User</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.is_disabled ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {user.is_disabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatus(user)}
                        disabled={togglingId === user.id || user.is_admin}
                        title={user.is_admin ? "Cannot disable admin" : ""}
                        className={`bf-btn-interactive rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-default ${
                          user.is_disabled
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        {togglingId === user.id ? "…" : user.is_disabled ? "Enable" : "Disable"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
