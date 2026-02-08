import { ShieldCheck } from "lucide-react";

export default function Admin() {
  return (
    <div className="bf-card p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-indigo-600" />
        <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
      </div>
      <p className="mt-1 text-sm text-slate-500">Admin dashboard overview.</p>
    </div>
  );
}
