import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  LayoutDashboard, Users, CandlestickChart, TrendingUp,
  TrendingDown, BarChart2, DollarSign, Activity,
} from "lucide-react";

const fmt = (n, d = 2) =>
  Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    let isMounted = true;
    api.get("/admin/stats")
      .then((data) => { if (isMounted) setStats(data); })
      .catch((err) => { if (isMounted) setError(err?.message || "Failed to load stats."); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const STAT_CARDS = stats
    ? [
        { label: "Total Users",       value: stats.total_users,       icon: Users,            color: "bg-indigo-100 text-indigo-600" },
        { label: "Total Trades",      value: stats.total_trades,      icon: Activity,         color: "bg-amber-100 text-amber-600" },
        { label: "Total Volume (Ⓥ)",  value: `${fmt(stats.total_volume)}`, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
        { label: "Instruments Live",  value: stats.total_instruments, icon: CandlestickChart, color: "bg-slate-100 text-slate-600" },
        { label: "Buy Orders",        value: stats.buy_trades,        icon: TrendingUp,       color: "bg-emerald-100 text-emerald-600" },
        { label: "Sell Orders",       value: stats.sell_trades,       icon: TrendingDown,     color: "bg-rose-100 text-rose-600" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-2 bf-card px-6 py-4">
        <LayoutDashboard className="h-5 w-5 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Platform-wide statistics and management.</p>
        </div>
      </header>

      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => <div key={i} className="bf-card h-24" />)}
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAT_CARDS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bf-card bf-card-hover p-6 flex items-center gap-4">
                <div className={`rounded-xl p-3 ${s.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin/users" className="bf-card bf-card-hover p-6 flex items-center gap-4 group">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-slate-900 group-hover:text-indigo-700">Manage Users</p>
            <p className="text-sm text-slate-500">Enable, disable, and view all registered users.</p>
          </div>
          <span className="ml-auto text-slate-300 group-hover:text-indigo-400">→</span>
        </Link>
        <Link to="/admin/instruments" className="bf-card bf-card-hover p-6 flex items-center gap-4 group">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
            <CandlestickChart className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-slate-900 group-hover:text-amber-700">Manage Instruments</p>
            <p className="text-sm text-slate-500">Add, edit, and update trading instruments.</p>
          </div>
          <span className="ml-auto text-slate-300 group-hover:text-amber-400">→</span>
        </Link>
      </section>
    </div>
  );
}
