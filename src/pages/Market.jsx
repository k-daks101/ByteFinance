import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { getBatchQuotes } from "../services/marketData";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../components/Table";
import { LineChart } from "lucide-react";

export default function Market() {
  const [instruments, setInstruments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dailyBrief, setDailyBrief] = useState(null);
  const [dailyBriefLoading, setDailyBriefLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchInstruments = async () => {
      if (isMounted) {
        setDailyBriefLoading(true);
      }

      try {
        const brief = await api.get("/daily-brief").catch(() => null);

        if (isMounted) {
          setDailyBrief(
            brief
              ? {
                  summary: brief.summary_text || "Market is active today.",
                  sentiment: brief.sentiment || "Neutral",
                  date: brief.insight_date || null,
                }
              : {
                  summary: "Daily AI Market Brief is temporarily unavailable.",
                  sentiment: "Neutral",
                  date: null,
                }
          );
        }

        // Try backend API first
        const data = await api.get("/instruments");
        if (isMounted) {
          setInstruments(Array.isArray(data) ? data : data?.items || []);
        }
      } catch (err) {
        // Fallback to Alpha Vantage API if backend fails
        console.warn("Backend API failed, trying Alpha Vantage:", err);
        try {
          // Popular stocks to display as fallback
          const symbols = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'NFLX'];
          const quotes = await getBatchQuotes(symbols, 'alphavantage');
          
          if (isMounted) {
            setInstruments(quotes.map(quote => ({
              id: quote.symbol,
              symbol: quote.symbol,
              name: quote.symbol, // You might want to add company names
              price: `$${quote.price.toFixed(2)}`,
            })));
          }
        } catch (fallbackErr) {
          if (isMounted) {
            setError(
              err?.message ||
              "Unable to load instruments from backend or market data API."
            );
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setDailyBriefLoading(false);
        }
      }
    };

    fetchInstruments();

    // Set up polling for real-time updates (every 60 seconds to respect API limits)
    const interval = setInterval(fetchInstruments, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return instruments;
    return instruments.filter((item) => {
      const symbol = String(item.symbol || "").toLowerCase();
      const name = String(item.name || "").toLowerCase();
      return symbol.includes(q) || name.includes(q);
    });
  }, [instruments, query]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Market Prices</h1>
        </div>
        <p className="text-sm text-slate-500">
          Browse available instruments and current prices.
        </p>
      </header>

      <section className="bf-card p-6 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">Daily AI Market Brief</h2>
            {dailyBrief?.sentiment && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  dailyBrief.sentiment === "Bullish"
                    ? "bg-emerald-100 text-emerald-700"
                    : dailyBrief.sentiment === "Bearish"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-200 text-slate-700"
                }`}
              >
                {dailyBrief.sentiment}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">
            {dailyBriefLoading
              ? "Loading daily brief..."
              : dailyBrief?.summary || "No brief available."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <label htmlFor="search" className="text-sm text-slate-600">
              Search
            </label>
            <input
              id="search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by symbol or name"
              className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            />
          </div>
          <div className="bf-chip">
            Showing {filtered.length} instrument{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        {loading && (
          <p className="text-sm text-slate-500">Loading instruments...</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="rounded-xl border border-slate-100 bf-card-hover">
            <Table className="border-0 rounded-none">
              <TableHead>
                <tr>
                  <TableHeaderCell>Symbol</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Price</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id || item.symbol}>
                    <TableCell>{item.symbol}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-sm text-slate-500">
                      No instruments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
