import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../components/Table";
import { ReceiptText } from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        // API: GET /api/transactions -> array | { items: array }
        const data = await api.get("/transactions");
        const list = Array.isArray(data) ? data : data?.items || [];
        if (isMounted) {
          setTransactions(list);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.message ||
              "Unable to load transactions."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTransactions();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchTransactions, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const aDate = new Date(a.date || a.createdAt || 0).getTime();
      const bDate = new Date(b.date || b.createdAt || 0).getTime();
      return bDate - aDate;
    });
  }, [transactions]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
        </div>
        <p className="text-sm text-slate-500">
          History of simulated trades and transfers.
        </p>
      </header>

      {loading && <p className="text-sm text-slate-500">Loading transactions...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <section className="bf-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
            <span className="bf-chip">{sorted.length} entries</span>
          </div>
          <div className="rounded-xl border border-slate-100 bf-card-hover">
            <Table className="border-0 rounded-none">
              <TableHead>
                <tr>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Instrument</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Quantity</TableHeaderCell>
                  <TableHeaderCell>Price</TableHeaderCell>
                  <TableHeaderCell>Total Value</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {sorted.map((tx) => (
                  <TableRow key={tx.id || `${tx.instrument}-${tx.date}`}>
                    <TableCell>{tx.date || tx.createdAt}</TableCell>
                    <TableCell>{tx.instrument || tx.symbol}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.quantity}</TableCell>
                    <TableCell>{tx.price}</TableCell>
                    <TableCell>{tx.totalValue}</TableCell>
                  </TableRow>
                ))}
                {sorted.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-sm text-slate-500">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </div>
  );
}
