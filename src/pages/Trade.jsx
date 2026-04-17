import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import {
  Activity, LineChart, ShieldCheck, Wallet, Star, StarOff,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  RefreshCw, X, Search, Plus, ExternalLink,
} from "lucide-react";
import TradingViewWidget from "../components/TradingViewWidget";
import { MOCK_INSTRUMENTS, enrichInstruments } from "../services/mockInstruments";

const FALLBACK_BALANCE_KEY = "bytefinance_virtual_balance";
const FALLBACK_WATCHLIST_KEY = "bytefinance_watchlist_ids";
const FALLBACK_TRADES_KEY = "bytefinance_simulated_trades";
const DEFAULT_FALLBACK_BALANCE = 10000;

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

const getThirdPartyTradingUrl = (instrument) => {
  const query = [instrument?.symbol, instrument?.name].filter(Boolean).join(" ");

  if (!query) {
    return "https://www.tradingview.com/";
  }

  return `https://www.tradingview.com/search/?query=${encodeURIComponent(query)}`;
};

const unwrapPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const unwrapObject = (payload) => {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
      return payload.data;
    }
    return payload;
  }
  return null;
};

const getStoredFallbackBalance = () => {
  const parsed = Number(localStorage.getItem(FALLBACK_BALANCE_KEY));
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_FALLBACK_BALANCE;
};

const setStoredFallbackBalance = (value) => {
  if (Number.isFinite(value) && value >= 0) {
    localStorage.setItem(FALLBACK_BALANCE_KEY, String(value));
  }
};

const getStoredFallbackWatchlist = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(FALLBACK_WATCHLIST_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];

    const ids = [...new Set(parsed.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];
    return ids.map((id) => ({ instrument_id: id }));
  } catch {
    return [];
  }
};

const setStoredFallbackWatchlist = (watchlistItems) => {
  const ids = [...new Set((watchlistItems || []).map((w) => Number(w.instrument_id)).filter((id) => Number.isInteger(id) && id > 0))];
  localStorage.setItem(FALLBACK_WATCHLIST_KEY, JSON.stringify(ids));
};

const getStoredFallbackTrades = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(FALLBACK_TRADES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setStoredFallbackTrades = (trades) => {
  localStorage.setItem(FALLBACK_TRADES_KEY, JSON.stringify(trades || []));
};

const toggleWatchlistItems = (watchlistItems, instrumentId) => {
  const numericId = Number(instrumentId);
  const exists = (watchlistItems || []).some((w) => Number(w.instrument_id) === numericId);
  if (exists) {
    return (watchlistItems || []).filter((w) => Number(w.instrument_id) !== numericId);
  }
  return [...(watchlistItems || []), { instrument_id: numericId }];
};

const resolveRiskLevel = (openPositions, avgVolatility) => {
  if (openPositions >= 6 || avgVolatility >= 4) return "High";
  if (openPositions >= 3 || avgVolatility >= 2) return "Medium";
  return "Low";
};

const getNetHoldingsFromTrades = (trades) => {
  return (trades || []).reduce((holdings, trade) => {
    const instrumentId = Number(trade.instrument_id);
    if (!Number.isInteger(instrumentId) || instrumentId <= 0) {
      return holdings;
    }

    const qty = Number(trade.quantity ?? 0);
    const signedQty = trade.side === "sell" ? -qty : qty;
    holdings[instrumentId] = (holdings[instrumentId] || 0) + signedQty;
    return holdings;
  }, {});
};

const buildFallbackStats = (instruments, watchlist, simulatedTrades = [], balance = getStoredFallbackBalance()) => {
  const watchlistIds = new Set((watchlist || []).map((w) => w.instrument_id));
  const netHoldings = getNetHoldingsFromTrades(simulatedTrades);
  const openPositionIds = Object.entries(netHoldings)
    .filter(([, qty]) => qty > 0)
    .map(([id]) => Number(id));

  const watchedInstruments = instruments.filter((i) => watchlistIds.has(i.id) || openPositionIds.includes(i.id));
  const sample = watchedInstruments.length > 0 ? watchedInstruments : instruments.slice(0, 8);

  const avgChange = sample.length > 0
    ? sample.reduce((sum, item) => sum + Number(item.change_percent ?? 0), 0) / sample.length
    : 0;

  const avgVolatility = sample.length > 0
    ? sample.reduce((sum, item) => sum + Math.abs(Number(item.change_percent ?? 0)), 0) / sample.length
    : 0;

  const openPositions = openPositionIds.length > 0 ? openPositionIds.length : watchlistIds.size;

  return {
    virtualBalance: `Ⓥ ${fmt(balance)}`,
    openPositions,
    todayPL: `${avgChange >= 0 ? "+" : ""}${fmt(avgChange)}%`,
    riskLevel: resolveRiskLevel(openPositions, avgVolatility),
  };
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
  const [simulatedTrades, setSimulatedTrades] = useState([]);
  const [portfolio, setPortfolio]       = useState(null);
  const [dailyBrief, setDailyBrief]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [usingLocalWatchlist, setUsingLocalWatchlist] = useState(false);

  /* ── watchlist modal state ── */
  const [showWLModal, setShowWLModal]   = useState(false);
  const [wlSearch, setWlSearch]         = useState("");
  const [wlLoading, setWlLoading]       = useState({});

  /* ── table state ── */
  const [activeTab, setActiveTab]       = useState("all");
  const [tableSearch, setTableSearch]   = useState("");

  /* ── stats ── */
  const [stats, setStats] = useState({
    virtualBalance: `Ⓥ ${fmt(DEFAULT_FALLBACK_BALANCE)}`,
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
        const parsedInstruments = unwrapPayload(instRes.value);
        if (parsedInstruments.length > 0) {
          setInstruments(enrichInstruments(parsedInstruments));
          setUsingMockData(false);
        } else {
          setInstruments(enrichInstruments(MOCK_INSTRUMENTS));
          setUsingMockData(true);
        }
      } else {
        setInstruments(enrichInstruments(MOCK_INSTRUMENTS));
        setUsingMockData(true);
      }

      if (wlRes.status === "fulfilled") {
        const backendWatchlist = unwrapPayload(wlRes.value);
        setWatchlist(backendWatchlist);
        setUsingLocalWatchlist(false);
        setStoredFallbackWatchlist(backendWatchlist);
      } else {
        setWatchlist(getStoredFallbackWatchlist());
        setUsingLocalWatchlist(true);
      }

      if (portfolioRes.status === "fulfilled") {
        const p = unwrapObject(portfolioRes.value);
        if (p) {
          setPortfolio(p);
          setStoredFallbackBalance(Number(p.cashBalance ?? DEFAULT_FALLBACK_BALANCE));
        } else {
          setPortfolio(null);
        }
      } else {
        setPortfolio(null);
      }

      if (briefRes.status === "fulfilled" && briefRes.value) {
        setDailyBrief(unwrapObject(briefRes.value) ?? briefRes.value);
      }

      if (tradesRes.status === "fulfilled") {
        const trades = unwrapPayload(tradesRes.value);
        setRecentTrades(trades.slice(0, 6));
        setSimulatedTrades([]);
      } else {
        const fallbackTrades = getStoredFallbackTrades();
        setSimulatedTrades(fallbackTrades);
        setRecentTrades(fallbackTrades.slice(0, 6));
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

  useEffect(() => {
    if (portfolio) {
      setStats({
        virtualBalance: `Ⓥ ${fmt(portfolio.cashBalance)}`,
        openPositions:  portfolio.holdingsCount ?? 0,
        todayPL:        `${portfolio.totalPLPercent >= 0 ? "+" : ""}${fmt(portfolio.totalPLPercent)}%`,
        riskLevel:      resolveRiskLevel(portfolio.holdingsCount ?? 0, Math.abs(Number(portfolio.totalPLPercent ?? 0))),
      });
      return;
    }

    setStats(buildFallbackStats(instruments, watchlist, simulatedTrades));
  }, [portfolio, instruments, watchlist, simulatedTrades]);

  const resetFallbackBalance = () => {
    setStoredFallbackBalance(DEFAULT_FALLBACK_BALANCE);
    setStoredFallbackTrades([]);
    setSimulatedTrades([]);
    setRecentTrades([]);
    if (!portfolio) {
      setStats((prev) => ({
        ...prev,
        virtualBalance: `Ⓥ ${fmt(DEFAULT_FALLBACK_BALANCE)}`,
        openPositions: 0,
        todayPL: "+0.0%",
        riskLevel: "Low",
      }));
    }
    setSuccess(`Demo balance reset to Ⓥ ${fmt(DEFAULT_FALLBACK_BALANCE)}.`);
  };

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

    const shouldSimulateTrade = usingMockData || !portfolio;

    if (shouldSimulateTrade) {
      const instrument = instruments.find((item) => String(item.id) === String(form.instrumentId));
      const quantity = Number(form.quantity);

      if (!instrument) {
        setError("Please select an instrument.");
        return;
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        setError("Enter a valid quantity greater than zero.");
        return;
      }

      const tradeValue = Number((Number(instrument.current_price) * quantity).toFixed(2));
      const currentBalance = getStoredFallbackBalance();
      const netHoldings = getNetHoldingsFromTrades(simulatedTrades);
      const currentHolding = Number(netHoldings[instrument.id] || 0);

      if (form.side === "buy" && tradeValue > currentBalance) {
        setError(`Insufficient demo balance. You need Ⓥ ${fmt(tradeValue)} but have Ⓥ ${fmt(currentBalance)}.`);
        return;
      }

      if (form.side === "sell" && quantity > currentHolding) {
        setError(`You only own ${fmt(currentHolding, 4)} units of ${instrument.symbol} in demo mode.`);
        return;
      }

      const nextBalance = form.side === "buy"
        ? Number((currentBalance - tradeValue).toFixed(2))
        : Number((currentBalance + tradeValue).toFixed(2));

      const simulatedTrade = {
        id: `sim-${Date.now()}`,
        side: form.side,
        quantity,
        price_at_trade: Number(instrument.current_price),
        total_value: tradeValue,
        balance_after: nextBalance,
        status: "completed",
        created_at: new Date().toISOString(),
        instrument: {
          id: instrument.id,
          symbol: instrument.symbol,
          name: instrument.name,
          type: instrument.type,
        },
        instrument_id: instrument.id,
      };

      const nextTrades = [simulatedTrade, ...simulatedTrades].slice(0, 50);
      setStoredFallbackBalance(nextBalance);
      setStoredFallbackTrades(nextTrades);
      setSimulatedTrades(nextTrades);
      setRecentTrades(nextTrades.slice(0, 6));
      setSuccess(`${form.side === "buy" ? "Bought" : "Sold"} ${fmt(quantity, 4)} ${instrument.symbol} in demo mode. New demo balance: Ⓥ ${fmt(nextBalance)}.`);
      setForm((prev) => ({ ...prev, quantity: "" }));
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post("/trades", {
        instrument_id: Number(form.instrumentId),
        side:          form.side,
        quantity:      Number(form.quantity),
      });
      const verb = form.side === "buy" ? "Bought" : "Sold";
      setSuccess(`${verb} ${form.quantity} units successfully. New balance: Ⓥ ${fmt(res.virtual_balance)}`);
      if (Number.isFinite(Number(res?.virtual_balance))) {
        setStoredFallbackBalance(Number(res.virtual_balance));
      }
      setForm((prev) => ({ ...prev, quantity: "" }));
      await fetchData(true);
    } catch (err) {
      setError(
        err?.errors?.instrument_id?.[0] ||
        err?.errors?.quantity?.[0] ||
        err?.error ||
        err?.message ||
        "Unable to submit trade."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Watchlist toggle ──────────────────────────────────────────────────────
  const handleWatchlistToggle = async (instrumentId) => {
    const inWL = watchlist.some((w) => Number(w.instrument_id) === Number(instrumentId));
    setWlLoading((prev) => ({ ...prev, [instrumentId]: true }));

    if (usingMockData || usingLocalWatchlist) {
      setWatchlist((prev) => {
        const next = toggleWatchlistItems(prev, instrumentId);
        setStoredFallbackWatchlist(next);
        return next;
      });
      setWlLoading((prev) => ({ ...prev, [instrumentId]: false }));
      return;
    }

    try {
      if (inWL) {
        await api.delete(`/watchlist/${instrumentId}`);
        setWatchlist((prev) => prev.filter((w) => Number(w.instrument_id) !== Number(instrumentId)));
      } else {
        await api.post("/watchlist", { instrument_id: instrumentId });
        await fetchData(true);
      }
    } catch (err) {
      console.error("Watchlist toggle error:", err);
      // Fail over to local persistence if backend watchlist endpoint is unavailable.
      setUsingLocalWatchlist(true);
      setWatchlist((prev) => {
        const next = toggleWatchlistItems(prev, instrumentId);
        setStoredFallbackWatchlist(next);
        return next;
      });
      setError("Watchlist backend is unavailable. Watchlist changes are being saved locally.");
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

  const tableData = activeTab === "all" 
    ? instruments 
    : instruments.filter((i) => watchlistIds.has(i.id));

  const filteredTableData = tableData.filter((i) => {
    const s = tableSearch.toLowerCase();
    return i.symbol?.toLowerCase().includes(s) || i.name?.toLowerCase().includes(s);
  });

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
            {!portfolio && (
              <button
                type="button"
                onClick={resetFallbackBalance}
                className="ml-2 rounded-md border border-amber-200 bg-white px-2 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100"
                title="Reset demo balance to the default amount"
              >
                Reset
              </button>
            )}
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

      {/* ── Markets & Watchlist Table ── */}
      <section className="bf-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Markets</h2>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                All Assets
              </button>
              <button
                onClick={() => setActiveTab("watchlist")}
                className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all ${activeTab === "watchlist" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Watchlist ({watchlistIds.size})
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search assets…"
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>

        {usingMockData && (
          <div className="border-b border-amber-100 bg-amber-50 px-6 py-2.5 text-xs text-amber-700">
            Live backend market feed is unavailable. Showing simulated fallback market data.
          </div>
        )}

        {usingLocalWatchlist && (
          <div className="border-b border-sky-100 bg-sky-50 px-6 py-2.5 text-xs text-sky-700">
            Watchlist is currently running in local mode. Changes are stored in this browser.
          </div>
        )}

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto bf-scrollbar">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs font-semibold text-slate-500 shadow-sm z-10">
              <tr>
                <th className="px-6 py-3 text-left">Asset</th>
                <th className="px-6 py-3 text-right">Price (Ⓥ)</th>
                <th className="px-6 py-3 text-right">Change</th>
                <th className="px-6 py-3 text-right hidden sm:table-cell">Prev Close</th>
                <th className="px-6 py-3 text-center">Watchlist</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">Loading…</td></tr>
              ) : filteredTableData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    {instruments.length === 0
                      ? "No market data loaded. Check the backend connection or rerun the instrument seeder."
                      : activeTab === "watchlist" && tableSearch === ""
                        ? "Your watchlist is empty. Switch to 'All Assets' to add some."
                        : "No instruments found matching your search."}
                  </td>
                </tr>
              ) : (
                filteredTableData.map((item) => {
                  const changePos = (item.change_percent ?? 0) >= 0;
                  const inWL = watchlistIds.has(item.id);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                            {item.symbol?.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{item.symbol}</p>
                            <p className="text-[11px] text-slate-400 max-w-[140px] truncate">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right font-mono font-bold text-slate-900">
                        {fmt(item.current_price, 4)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${changePos ? "text-emerald-600" : "text-rose-600"}`}>
                          {changePos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          {changePos ? "+" : ""}{fmt(item.change_percent)}%
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-slate-400 hidden sm:table-cell">
                        {fmt(item.previous_price, 4)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleWatchlistToggle(item.id)}
                          disabled={wlLoading[item.id]}
                          className={`bf-btn-interactive rounded-full p-2 transition-colors disabled:opacity-50 ${
                            inWL ? "text-amber-400 hover:bg-amber-50" : "text-slate-300 hover:text-amber-400 hover:bg-amber-50"
                          }`}
                          title={inWL ? "Remove from Watchlist" : "Add to Watchlist"}
                        >
                          {inWL ? <Star className="h-4 w-4 fill-amber-400" /> : <StarOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setForm((prev) => ({ ...prev, instrumentId: String(item.id) }));
                              // Smooth scroll to trade form if desired, or just let it snap via state
                            }}
                            className="bf-btn-interactive rounded-lg bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 hover:border-indigo-600"
                          >
                            Trade
                          </button>
                          <a
                            href={getThirdPartyTradingUrl(item)}
                            target="_blank"
                            rel="noreferrer"
                            className="bf-btn-interactive inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                            title="Open this instrument on TradingView"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            TradingView
                          </a>
                        </div>
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
              <div className="space-y-3">
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
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
                    <a
                      href={getThirdPartyTradingUrl(selectedInstrument)}
                      target="_blank"
                      rel="noreferrer"
                      className="bf-btn-interactive inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                      title="Open this instrument on TradingView"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open on TradingView
                    </a>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white h-[400px]">
                  <TradingViewWidget symbol={selectedInstrument.symbol} />
                </div>
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
            {submitting
              ? "Submitting…"
              : usingMockData || !portfolio
                ? `Simulate ${form.side === "sell" ? "Sell" : "Buy"}`
                : `Review & ${form.side === "sell" ? "Sell" : "Buy"}`}
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
