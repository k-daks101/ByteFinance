import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { CandlestickChart, Plus, RefreshCw, Pencil, Trash2, Check, X, Search } from "lucide-react";

const fmt = (n, d = 2) =>
  Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const TYPE_COLORS = {
  stock:  "bg-indigo-100 text-indigo-700",
  crypto: "bg-orange-100 text-orange-700",
  forex:  "bg-sky-100 text-sky-700",
};

const BLANK_FORM = { symbol: "", name: "", type: "stock", sector: "", description: "", current_price: "" };

export default function ManageInstruments() {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [refreshing, setRefreshing]   = useState(false);

  /* ── Add / Edit form ── */
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(BLANK_FORM);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState("");

  /* ── Delete ── */
  const [deletingId, setDeletingId] = useState(null);

  const fetchInstruments = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const data = await api.get("/admin/instruments");
      setInstruments(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err?.message || "Unable to load instruments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchInstruments(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(BLANK_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (inst) => {
    setEditId(inst.id);
    setForm({
      symbol:        inst.symbol,
      name:          inst.name,
      type:          inst.type,
      sector:        inst.sector ?? "",
      description:   inst.description ?? "",
      current_price: String(inst.current_price),
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        current_price: Number(form.current_price),
      };
      if (editId) {
        const updated = await api.put(`/admin/instruments/${editId}`, payload);
        setInstruments((prev) => prev.map((i) => i.id === editId ? { ...i, ...updated } : i));
      } else {
        const created = await api.post("/admin/instruments", payload);
        setInstruments((prev) => [...prev, created]);
      }
      setShowForm(false);
    } catch (err) {
      const msgs = err?.errors
        ? Object.values(err.errors).flat().join(" ")
        : (err?.message || "Save failed.");
      setFormError(msgs);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (inst) => {
    if (!window.confirm(`Delete ${inst.symbol}? This cannot be undone.`)) return;
    setDeletingId(inst.id);
    try {
      await api.delete(`/admin/instruments/${inst.id}`);
      setInstruments((prev) => prev.filter((i) => i.id !== inst.id));
    } catch (err) {
      setError(err?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = instruments.filter(
    (i) =>
      search.trim() === "" ||
      i.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      i.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between bf-card px-6 py-4">
        <div className="flex items-center gap-2">
          <CandlestickChart className="h-5 w-5 text-amber-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Instruments</h1>
            <p className="text-sm text-slate-500">Add, edit, and control tradeable instruments.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchInstruments(true)}
            disabled={refreshing}
            className="bf-btn-interactive rounded-lg border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openAdd}
            className="bf-btn-interactive flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Instrument
          </button>
        </div>
      </header>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by symbol or name…"
          className="w-full max-w-sm rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      <section className="bf-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">All Instruments</h2>
          <span className="text-xs text-slate-400">{filtered.length} listed</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">Instrument</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Sector</th>
                  <th className="px-6 py-3 text-right">Current Price</th>
                  <th className="px-6 py-3 text-right">Change %</th>
                  <th className="px-6 py-3 text-center">Trades</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inst) => {
                  const changePos = (inst.change_percent ?? 0) >= 0;
                  return (
                    <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900">{inst.symbol}</p>
                          <p className="text-xs text-slate-400">{inst.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[inst.type] ?? "bg-slate-100 text-slate-600"}`}>
                          {inst.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{inst.sector ?? "—"}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                        Ⓥ {fmt(inst.current_price, 4)}
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-semibold ${changePos ? "text-emerald-600" : "text-rose-600"}`}>
                        {changePos ? "+" : ""}{fmt(inst.change_percent)}%
                      </td>
                      <td className="px-6 py-4 text-center text-slate-700 font-semibold">
                        {inst.trades_count ?? 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${inst.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                          {inst.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(inst)}
                            className="bf-btn-interactive rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(inst)}
                            disabled={deletingId === inst.id}
                            className="bf-btn-interactive rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-500 hover:bg-rose-100 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400">No instruments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form onSubmit={handleSave} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900">{editId ? "Edit Instrument" : "Add New Instrument"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="bf-btn-interactive rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</div>}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-600">Symbol *</label>
                  <input
                    value={form.symbol}
                    onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value.toUpperCase() }))}
                    disabled={!!editId}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    required
                  >
                    <option value="stock">Stock</option>
                    <option value="crypto">Crypto</option>
                    <option value="forex">Forex</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-600">Sector</label>
                  <input
                    value={form.sector}
                    onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Current Price (Ⓥ) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.current_price}
                    onChange={(e) => setForm((p) => ({ ...p, current_price: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Instrument"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
