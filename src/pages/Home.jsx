import { Home as HomeIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-100 bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white shadow-sm bf-card-hover">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-100">
          <HomeIcon className="h-4 w-4" />
          ByteFinance
        </div>
        <h1 className="mt-3 text-3xl font-bold">
          Academic trading simulation platform
        </h1>
        <p className="mt-2 text-sm text-indigo-100 max-w-2xl">
          Learn financial literacy through guided lessons, safe trading practice,
          and a supportive community.
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "Explore the market simulator",
          "Practice with virtual trades",
          "Track portfolio performance",
        ].map((item) => (
          <div
            key={item}
            className="bf-card bf-card-hover p-6 text-sm text-slate-600"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
