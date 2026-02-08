import { Link } from "react-router-dom";

export const NotFoundView = (): JSX.Element => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Page not found</h2>
      <p className="text-sm text-slate-500">The page you requested does not exist.</p>
      <Link to="/dashboard" className="text-sm font-semibold text-slate-900 underline">
        Go back to dashboard
      </Link>
    </div>
  );
};
