import { Link } from "react-router-dom";
import { ShieldCheck, Users, Boxes } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <section className="bf-card p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Manage platform users and tradable instruments.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/users"
          className="bf-card bf-card-hover p-5"
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Manage Users</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Enable, disable, and review user accounts.
          </p>
          <div className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600">
            Go to Users →
          </div>
        </Link>
        <Link
          to="/admin/instruments"
          className="bf-card bf-card-hover p-5"
        >
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Manage Instruments</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create and maintain tradable assets.
          </p>
          <div className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600">
            Go to Instruments →
          </div>
        </Link>
      </section>
    </div>
  );
}
