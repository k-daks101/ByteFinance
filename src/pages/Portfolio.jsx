import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../components/Table";
import { Briefcase } from "lucide-react";

export default function Portfolio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchPortfolio = async () => {
      try {
        // API: GET /api/portfolio -> portfolio summary and holdings
        const response = await api.get("/portfolio");
        if (isMounted) {
          setData(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.message ||
              "Unable to load portfolio."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPortfolio();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchPortfolio, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const cashBalance = data?.cashBalance ?? data?.cash ?? "";
  const portfolioValue = data?.portfolioValue ?? data?.totalValue ?? "";
  const holdings = data?.holdings ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Portfolio</h1>
        </div>
        <p className="text-sm text-slate-500">
          Review your simulated cash and holdings.
        </p>
      </header>

      {loading && <p className="text-sm text-slate-500">Loading portfolio...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bf-card bf-card-hover p-6">
              <p className="text-sm text-slate-500">Cash Balance</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{cashBalance}</p>
              <p className="mt-1 text-xs text-slate-400">Virtual currency</p>
            </div>
            <div className="bf-card bf-card-hover p-6">
              <p className="text-sm text-slate-500">Portfolio Value</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {portfolioValue}
              </p>
              <p className="mt-1 text-xs text-slate-400">Total holdings value</p>
            </div>
            <div className="bf-card bf-card-hover p-6">
              <p className="text-sm text-slate-500">Holdings Count</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {holdings.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">Active positions</p>
            </div>
          </section>

          <section className="bf-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Holdings</h2>
              <span className="bf-chip">
                {holdings.length} assets
              </span>
            </div>
            <div className="rounded-xl border border-slate-100 bf-card-hover">
              <Table className="border-0 rounded-none">
                <TableHead>
                  <tr>
                    <TableHeaderCell>Symbol</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Quantity</TableHeaderCell>
                    <TableHeaderCell>Value</TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody>
                  {holdings.map((item) => (
                    <TableRow key={item.id || item.symbol}>
                      <TableCell>{item.symbol}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.value}</TableCell>
                    </TableRow>
                  ))}
                  {holdings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-sm text-slate-500">
                        No holdings available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
