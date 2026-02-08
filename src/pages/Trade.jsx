import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import {
  Activity,
  LineChart,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export default function Trade() {
  const [form, setForm] = useState({
    instrumentId: "",
    side: "buy",
    quantity: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const watchlist = [
    { name: "Apple Inc.", symbol: "AAPL", price: "178.42", change: "+2.34%", volume: "1.2M", trend: "up" },
    { name: "Tesla Motors", symbol: "TSLA", price: "242.18", change: "-1.87%", volume: "2.8M", trend: "down" },
    { name: "Microsoft Corp.", symbol: "MSFT", price: "412.56", change: "+0.92%", volume: "890K", trend: "up" },
    { name: "NVIDIA Corp.", symbol: "NVDA", price: "875.28", change: "+5.67%", volume: "3.1M", trend: "up" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // API: POST /api/trades -> success response
      await axios.post("/api/trades", {
        instrumentId: form.instrumentId,
        side: form.side,
        quantity: Number(form.quantity),
      });
      setSuccess("Trade submitted successfully.");
      setForm({ instrumentId: "", side: "buy", quantity: "" });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to submit trade.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 bf-card px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Trading Center</h1>
          </div>
          <p className="text-sm text-slate-500">
            Practice trading in a safe, simulated environment.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Wallet className="h-5 w-5 text-amber-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-amber-700">
                Virtual Balance
              </span>
              <span className="text-base font-bold text-amber-900">
                Ⓥ 10,000.00
              </span>
            </div>
          </div>
          <img
            className="h-10 w-10"
            alt="Notifications"
            src="https://c.animaapp.com/ml5cvposRsumK8/img/button-1.svg"
          />
        </div>
      </header>

      <section className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-indigo-50 p-4 bf-card-hover">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Safe-Space Trading Environment
            </h2>
            <p className="text-sm text-slate-600">
              All trades use virtual currency (Ⓥ). Practice without real-world risk.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2">
            <span className="block text-xs text-slate-500">Mode</span>
            <span className="text-base font-bold text-indigo-600">Basic</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Virtual Balance", value: "Ⓥ 10,000.00", tone: "text-amber-700" },
          { label: "Open Positions", value: "3", tone: "text-slate-700" },
          { label: "Today’s P/L", value: "+1.2%", tone: "text-emerald-600" },
          { label: "Risk Level", value: "Low", tone: "text-indigo-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bf-card bf-card-hover p-5"
          >
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Activity className="h-3.5 w-3.5" />
              {stat.label}
            </div>
            <p className={`mt-2 text-lg font-bold ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="bf-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Market Watchlist</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              All Markets
            </button>
            <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Favorites
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Asset</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Change</th>
                <th className="px-6 py-3 text-left font-semibold">Volume</th>
                <th className="px-6 py-3 text-left font-semibold">Trend</th>
                <th className="px-6 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {watchlist.map((item) => (
                <tr key={item.symbol} className="text-slate-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-600">
                        {item.symbol.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">Ⓥ {item.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        item.change.startsWith("-")
                          ? "font-semibold text-rose-500"
                          : "font-semibold text-emerald-600"
                      }
                    >
                      {item.change}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.volume}</td>
                  <td className="px-6 py-4">
                    <div className="h-2 w-16 rounded-full bg-slate-100">
                      <div
                        className={
                          item.trend === "down"
                            ? "h-2 w-10 rounded-full bg-rose-400"
                            : "h-2 w-12 rounded-full bg-emerald-400"
                        }
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="bf-card p-6 space-y-5"
        >
          <div className="space-y-1">
            <label htmlFor="instrumentId" className="text-sm text-slate-600">
              Instrument
            </label>
            <select
              id="instrumentId"
              name="instrumentId"
              value={form.instrumentId}
              onChange={handleChange}
              className="w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <option value="">Select an instrument</option>
              <option value="AAPL">AAPL</option>
              <option value="TSLA">TSLA</option>
              <option value="MSFT">MSFT</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="side" className="text-sm text-slate-600">
              Side
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, side: "buy" }))}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                  form.side === "buy"
                    ? "bg-emerald-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, side: "sell" }))}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                  form.side === "sell"
                    ? "bg-rose-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                Sell
              </button>
            </div>
          </div>
          <FormInput
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            label="Quantity"
            value={form.quantity}
            onChange={handleChange}
            inputClassName="max-w-sm"
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Review & Submit Trade"}
          </Button>
        </form>

        <aside className="space-y-6">
          <div className="bf-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Trading Insights</h2>
            <p className="text-sm text-slate-500">
              Use the simulator to practice order placement and risk management.
            </p>
            <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
              Trades here are simulated. No real money is involved.
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
              Tip: Set a virtual stop-loss to control downside risk.
            </div>
            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}
          </div>

          <div className="bf-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Watchlist</h3>
            <div className="space-y-3">
              {[
                { symbol: "AAPL", price: "$189.20", change: "+0.8%" },
                { symbol: "TSLA", price: "$252.30", change: "-1.4%" },
                { symbol: "MSFT", price: "$412.10", change: "+0.6%" },
              ].map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-slate-900">{item.symbol}</span>
                  <span className="text-slate-500">{item.price}</span>
                  <span
                    className={
                      item.change.startsWith("-")
                        ? "text-rose-500"
                        : "text-emerald-600"
                    }
                  >
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Manage Watchlist
            </button>
          </div>
        </aside>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="bf-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <span className="text-xs text-slate-400">Last 7 days</span>
          </div>
          <div className="space-y-3 text-sm">
            {[
              "Bought 5 shares of AAPL",
              "Sold 2 shares of TSLA",
              "Set alert: MSFT above $420",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-100 px-4 py-3 text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bf-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Market Movers</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "Top Gainer", value: "NVDA +3.4%" },
              { label: "Top Loser", value: "META -2.1%" },
              { label: "Most Volatile", value: "TSLA 5.6%" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-slate-500">{item.label}</span>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Data is for simulation guidance only.
          </div>
        </div>
      </section>
    </div>
  );
}
