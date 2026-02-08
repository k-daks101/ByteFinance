import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you requested does not exist.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Go back to dashboard
        </Link>
      </div>
    </div>
  );
}
