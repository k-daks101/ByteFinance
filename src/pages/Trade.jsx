import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import {
  Activity, LineChart, ShieldCheck, Wallet, Star, StarOff,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  RefreshCw, X, Search, Plus,
} from "lucide-react";

const fmt = (n, decimals = 2) =>
  Number(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

export default function Trade() {
  const [searchParams] = useSearchParams();

  /* ── form state ── */
  const [form, setForm] = useState({
    instrumentId: searchParams.get("instrumentId") || "",
    side:         "buy",
    quantity:     "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState("");
  const [error, setError]           = useState("");

  /* ── data state ── */
  const [instruments, setInstruments]   = useState([]);
  const [watchlist, setWatchlist]       = useState([]);   // full watchlist items with price data
  const [recentTrades, setRecentTrades] = useState([]);
  const [portfolio, setPortfolio]       = useState(null);
  const [dailyBrief, setDailyBrief]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  /* ── watchlist modal state ── */
  const [showWLModal, setShowWLModal]   = useState(false);
  const [wlSearch, setWlSearch]         = useState("");
  const [wlLoading, setWlLoading]       = useState({});

  /* ── stats ── */
  const [stats, setStats] = useState({
    virtualBalance: "Ⓥ 0.00",
    openPositions:  0,
    todayPL:        "+0.0%",
    riskLevel:      "Low",
  });

  // ── Fetch all data ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const [instRes, wlRes, portfolioRes, briefRes, tradesRes] = await Promise.allSettled([
        api.get("/instruments"),
        api.get("/watchlist"),
        api.get("/portfolio"),
        api.get("/daily-brief"),
        api.get("/trades"),
      ]);

      if (instRes.status === "fulfilled") {
        setInstruments(Array.isArray(instRes.value) ? instRes.value : []);
      }
      if (wlRes.status === "fulfilled") {
        setWatchlist(Array.isArray(wlRes.value) ? wlRes.value : []);
      }
      if (portfolioRes.status === "fulfilled") {
        const p = portfolioRes.value;
        setPortfolio(p);
        setStats({
          virtualBalance: `Ⓥ ${fmt(p.cashBalance)}`,
          openPositions:  p.holdingsCount ?? 0,
          todayPL:        `${p.totalPLPercent >= 0 ? "+" : ""}${fmt(p.totalPLPercent)}%`,
          riskLevel:      p.holdingsCount > 5 ? "High" : p.holdingsCount > 2 ? "Medium" : "Low",
        });
      }
      if (briefRes.status === "fulfilled" && briefRes.value) {
        setDailyBrief(briefRes.value);
      }
      if (tradesRes.status === "fulfilled") {
        const trades = Array.isArray(tradesRes.value) ? tradesRes.value : [];
        setRecentTrades(trades.slice(0, 6));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Pre-fill from URL param
  useEffect(() => {
    const urlInstrumentId = searchParams.get("instrumentId");
    if (urlInstrumentId) {
      setForm((prev) => ({ ...prev, instrumentId: urlInstrumentId }));
    }
  }, [searchParams]);

  // ── Submit trade ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await api.post("/trades", {
        instrument_id: Number(form.instrumentId),
        side:          form.side,
        quantity:      Number(form.quantity),
      });
      const verb = form.side === "buy" ? "Bought" : "Sold";
      setSuccess(`${verb} ${form.quantity} units successfully. New balance: Ⓥ ${fmt(res.virtual_balance)}`);
      setForm((prev) => ({ ...prev, quantity: "" }));
      await fetchData(true);
    } catch (err) {
      setError(
        err?.errors?.quantity?.[0] ||
        err?.message ||
        "Unable to submit trade."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Watchlist toggle ──────────────────────────────────────────────────────
  const handleWatchlistToggle = async (instrumentId) => {
    const inWL = watchlist.some((w) => w.instrument_id === instrumentId);
    setWlLoading((prev) => ({ ...prev, [instrumentId]: true }));
    try {
      if (inWL) {
        await api.delete(`/watchlist/${instrumentId}`);
        setWatchlist((prev) => prev.filter((w) => w.instrument_id !== instrumentId));
      } else {
        await api.post("/watchlist", { instrument_id: instrumentId });
        await fetchData(true);
      }
    } catch (err) {
      console.error("Watchlist toggle error:", err);
    } finally {
      setWlLoading((prev) => ({ ...prev, [instrumentId]: false }));
    }
  };

  // ── Computed values ───────────────────────────────────────────────────────
  const selectedInstrument = instruments.find(
    (i) => String(i.id) === String(form.instrumentId)
  );
  const estimatedCost = selectedInstrument && form.quantity
    ? fmt(selectedInstrument.current_price * Number(form.quantity))
    : null;

  const movers = [...instruments].sort(
    (a, b) => Math.abs(b.change_percent ?? 0) - Math.abs(a.change_percent ?? 0)
  ).slice(0, 4);

  const wlFiltered = instruments.filter((i) =>
    i.symbol?.toLowerCase().includes(wlSearch.toLowerCase()) ||
    i.name?.toLowerCase().includes(wlSearch.toLowerCase())
  );

  const watchlistIds = new Set(watchlist.map((w) => w.instrument_id));

  const STAT_CARDS = [
    { label: "Virtual Balance", value: stats.virtualBalance, tone: "text-amber-700" },
    { label: "Open Positions",  value: `${stats.openPositions}`, tone: "text-slate-800" },
    { label: "Overall P/L",     value: stats.todayPL, tone: stats.todayPL.startsWith("-") ? "text-rose-600" : "text-emerald-600" },
    { label: "Risk Level",      value: stats.riskLevel, tone: "text-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="flex flex-col gap-4 bf-card px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Trading Centre</h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Practice trading in a safe, simulated environment.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
            <Wallet className="h-4 w-4 text-amber-700" />
            <div>
              <span className="block text-xs text-amber-700">Virtual Balance</span>
              <span className="text-base font-bold text-amber-900">
                {loading ? "…" : stats.virtualBalance}
              </span>
            </div>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="bf-btn-interactive rounded-lg border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* ── Safe-space banner ── */}
      <section className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-indigo-50 p-4 bf-card-hover">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Safe-Space Trading Environment</h2>
            <p className="text-sm text-slate-600">All trades use virtual Ⓥ currency. Zero real-world risk.</p>
          </div>
          <div className="ml-auto rounded-lg border border-slate-200 bg-white px-4 py-2 text-center">
            <span className="block text-xs text-slate-500">Mode</span>
            <span className="text-base font-bold text-indigo-600">Simulated</span>
          </div>
        </div>
      </section>

      {/* ── Daily brief ── */}
      {dailyBrief && (
        <section className="bf-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Daily AI Market Brief</h2>
            {dailyBrief.sentiment && (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                dailyBrief.sentiment === "Bullish" ? "bg-emerald-100 text-emerald-700" :
                dailyBrief.sentiment === "Bearish" ? "bg-rose-100 text-rose-700" :
                "bg-slate-100 text-slate-700"
              }`}>{dailyBrief.sentiment}</span>
            )}
          </div>
          <p className="text-sm text-slate-600">
            {dailyBrief.summary_text || dailyBrief.summary || "No brief available."}
          </p>
        </section>
      )}

      {/* ── Stats bar ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bf-card bf-card-hover p-5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Activity className="h-3.5 w-3.5" />
              {s.label}
            </div>
            <p className={`mt-2 text-xl font-bold ${s.tone}`}>
              {loading ? "…" : s.value}
            </p>
          </div>
        ))}
      </section>

      {/* ── Watchlist table ── */}
      <section className="bf-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Market Watchlist</h2>
          </div>
          <button
            onClick={() => setShowWLModal(true)}
            className="bf-btn-interactive flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            <Plus className="h-3.5 w-3.5" />
            Manage Watchlist
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">Asset</th>
                <th className="px-6 py-3 text-right">Price (Ⓥ)</th>
                <th className="px-6 py-3 text-right">Change</th>
                <th className="px-6 py-3 text-right">Prev Close</th>
                <th className="px-6 py-3 text-center">Remove</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">Loading…</td></tr>
              ) : watchlist.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    Your watchlist is empty.{" "}
                    <button onClick={() => setShowWLModal(true)} className="text-indigo-600 font-semibold underline">
                      Add instruments →
                    </button>
                  </td>
                </tr>
              ) : (
                watchlist.map((item) => {
                  const changePos = (item.change_percent ?? 0) >= 0;
                  return (
                    <tr key={item.instrument_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                            {item.symbol?.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{item.symbol}</p>
                            <p className="text-xs text-slate-400 max-w-[140px] truncate">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                        {fmt(item.current_price, 4)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${changePos ? "text-emerald-600" : "text-rose-600"}`}>
                          {changePos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          {changePos ? "+" : ""}{fmt(item.change_percent)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-400">
                        {fmt(item.previous_price, 4)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleWatchlistToggle(item.instrument_id)}
                          disabled={wlLoading[item.instrument_id]}
                          className="bf-btn-interactive rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setForm((prev) => ({ ...prev, instrumentId: String(item.instrument_id) }))}
                          className="bf-btn-interactive rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Trade form + sidebar ── */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="bf-card p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Place a Trade</h2>

          {/* Instrument selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Instrument</label>
            <select
              value={form.instrumentId}
              onChange={(e) => setForm((prev) => ({ ...prev, instrumentId: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              required
            >
              <option value="">Select an instrument…</option>
              {instruments.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.symbol} — {inst.name} (Ⓥ {fmt(inst.current_price, 4)})
                </option>
              ))}
            </select>
          </div>

          {/* Live price card for selected instrument */}
          {selectedInstrument && (() => {
            const pos = (selectedInstrument.change_percent ?? 0) >= 0;
            return (
              <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-black text-indigo-700">
                      {selectedInstrument.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{selectedInstrument.symbol}</p>
                      <p className="text-xs text-slate-500">{selectedInstrument.name}</p>
                      {selectedInstrument.sector && (
                        <span className="mt-1 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {selectedInstrument.sector}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">
                      Ⓥ {fmt(selectedInstrument.current_price, 4)}
                    </p>
                    <span className={`inline-flex items-center gap-1 text-sm font-bold ${pos ? "text-emerald-600" : "text-rose-600"}`}>
                      {pos ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {pos ? "+" : ""}{fmt(selectedInstrument.change_percent)}%
                    </span>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Prev close: Ⓥ {fmt(selectedInstrument.previous_price, 4)}
                    </p>
                  </div>
                </div>
                {selectedInstrument.description && (
                  <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-500 leading-relaxed">
                    {selectedInstrument.description}
                  </p>
                )}
              </div>
            );
          })()}

          {/* Buy / Sell toggle */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Side</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, side: "buy" }))}
                className={`bf-btn-interactive flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
                  form.side === "buy"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, side: "sell" }))}
                className={`bf-btn-interactive flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
                  form.side === "sell"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-rose-300"
                }`}
              >
                SELL
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Quantity</label>
            <input
              type="number"
              min="0.0001"
              step="any"
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              placeholder="e.g. 5"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              required
            />
            {estimatedCost && (
              <p className="text-xs text-slate-400">
                Estimated {form.side === "buy" ? "cost" : "proceeds"}:{" "}
                <strong className="text-slate-700">Ⓥ {estimatedCost}</strong>
              </p>
            )}
          </div>

          {/* Feedback */}
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>
          )}

          <button
            type="submit"
            disabled={submitting || !form.instrumentId || !form.quantity}
            className={`w-full rounded-lg py-3 text-sm font-bold text-white shadow-sm transition-all ${
              form.side === "sell"
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {submitting ? "Submitting…" : `Review & ${form.side === "sell" ? "Sell" : "Buy"}`}
          </button>
        </form>

        {/* ── Sidebar ── */}
        <aside className="space-y-5">
          {/* Recent Activity */}
          <div className="bf-card p-6 space-y-4">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-slate-400">Loading…</p>
              ) : recentTrades.length === 0 ? (
                <p className="text-sm text-slate-400">No trades yet.</p>
              ) : (
                recentTrades.map((t) => {
                  const isBuy = t.side === "buy";
                  return (
                    <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isBuy ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {isBuy ? "B" : "S"}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {isBuy ? "Bought" : "Sold"} {fmt(t.quantity, 2)} {t.instrument?.symbol ?? "—"}
                          </p>
                          <p className="text-[11px] text-slate-400">{fmtDate(t.created_at)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isBuy ? "text-rose-600" : "text-emerald-600"}`}>
                        {isBuy ? "-" : "+"}Ⓥ {fmt(t.total_value)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Market Movers */}
          <div className="bf-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Market Movers</h3>
            <div className="space-y-2">
              {movers.map((m) => {
                const pos = (m.change_percent ?? 0) >= 0;
                return (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">{m.symbol}</span>
                    <span className={`font-bold ${pos ? "text-emerald-600" : "text-rose-600"}`}>
                      {pos ? "+" : ""}{fmt(m.change_percent)}%
                    </span>
                  </div>
                );
              })}
              {movers.length === 0 && <p className="text-sm text-slate-400">Loading movers…</p>}
            </div>
          </div>

          {/* Tips */}
          <div className="bf-card p-5 space-y-2 bg-indigo-50 border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700">💡 Trading Tips</p>
            <p className="text-xs text-indigo-600">Diversify across stocks, crypto, and forex to manage risk.</p>
            <p className="text-xs text-indigo-600">Never invest more than you can afford to lose — even in simulation!</p>
          </div>
        </aside>
      </div>

      {/* ── Watchlist Modal ── */}
      {showWLModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">Manage Watchlist</h3>
              <button onClick={() => setShowWLModal(false)} className="bf-btn-interactive rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={wlSearch}
                  onChange={(e) => setWlSearch(e.target.value)}
                  placeholder="Search instruments…"
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1.5">
                {wlFiltered.map((inst) => {
                  const inWL  = watchlistIds.has(inst.id);
                  const busy  = wlLoading[inst.id];
                  return (
                    <div key={inst.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{inst.symbol}</p>
                        <p className="text-xs text-slate-400">{inst.name}</p>
                      </div>
                      <button
                        onClick={() => handleWatchlistToggle(inst.id)}
                        disabled={busy}
                        className={`bf-btn-interactive flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                          inWL
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        } disabled:opacity-50`}
                      >
                        {busy ? "…" : inWL ? "Remove" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-3 text-right">
              <button onClick={() => setShowWLModal(false)} className="bf-btn-interactive rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
