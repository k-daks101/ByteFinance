import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../components/Table";
import { LineChart } from "lucide-react";

export default function Market() {
  const [instruments, setInstruments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchInstruments = async () => {
      try {
        // API: GET /api/instruments -> array | { items: array }
        const { data } = await axios.get("/api/instruments");
        if (isMounted) {
          setInstruments(Array.isArray(data) ? data : data?.items || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load instruments."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInstruments();

    return () => {
      isMounted = false;
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
