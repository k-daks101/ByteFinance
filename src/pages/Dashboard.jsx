import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4 bf-card px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500">
            Welcome back. Ready to master your money?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
            <button className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-indigo-700 shadow-sm">
              BASIC
            </button>
            <button className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50">
              ADVANCED
            </button>
          </div>
          <button className="h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-500">
            🔔
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-100 bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 shadow-sm bf-card-hover">
        <div className="max-w-2xl space-y-5 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/30 px-3 py-1 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            The Missing Subject
          </div>
          <h2 className="text-3xl font-bold">
            Why didn&apos;t they teach this in school?
          </h2>
          <p className="text-sm text-indigo-100 leading-6">
            Traditional education skips the most important life skill: Financial
            Literacy. ByteFinance bridges the gap with a safe trading simulation.
          </p>
          <Link
            to="/learning"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-slate-50"
          >
            Start Today&apos;s Lesson →
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Cash Balance", value: "$10,000.00", note: "Virtual Currency" },
            { title: "Total Value", value: "$12,450.20", note: "+24.5%" },
            { title: "Today&apos;s P/L", value: "-$120.50", note: "-1.2%" },
          ].map((card) => (
            <div
              key={card.title}
              className="bf-card bf-card-hover p-6"
            >
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-2 text-xs text-slate-400">{card.note}</p>
            </div>
          ))}
        </div>

        <div className="bf-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Financial Literacy</h3>
            <span className="text-sm text-indigo-600">Level 4</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            You&apos;re mastering the basics. Next up: Compound Interest.
          </p>
          <div className="mt-4 space-y-3 text-xs">
            {[
              { label: "Budgeting Basics", value: "100%", color: "bg-emerald-500" },
              { label: "Investing 101", value: "65%", color: "bg-indigo-600" },
              { label: "Taxes & Credit", value: "0%", color: "bg-slate-100" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/learning"
            className="mt-5 block rounded-lg bg-indigo-50 px-4 py-2 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          >
            View Full Curriculum
          </Link>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">The Learning Lab</h2>
            <Link to="/learning" className="text-sm font-semibold text-indigo-600">
              View All Lessons
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {["Modern Money Mechanics", "Investing Basics: Stocks vs. Bonds"].map(
              (title, index) => (
                <div
                  key={title}
                  className="bf-card bf-card-hover p-5"
                >
                  <div className="h-36 rounded-lg bg-slate-100 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Learn the essentials of financial literacy and building healthy habits.
                  </p>
                  <div className="mt-3 text-xs text-slate-400">
                    {index === 0 ? "15 min" : "20 min"}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="bf-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Quick Quiz: Risk Management
              </h3>
              <span className="text-xs text-slate-500">Question 3 of 5</span>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              Which of the following is the safest place to store an emergency fund?
            </p>
            <div className="mt-4 space-y-3">
              {["High-Yield Savings Account", "Government Bonds", "Cryptocurrency Wallet"].map(
                (option) => (
                  <button
                    key={option}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50"
                  >
                    {option}
                  </button>
                )
              )}
            </div>
            <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-60">
              Submit Answer
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Market Simulator</h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                SAFE MODE
              </span>
            </div>
            <div className="mt-4 h-40 rounded-lg bg-slate-100" />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">S&P 500 ETF</p>
                <p className="text-lg font-semibold text-slate-900">$412.50</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">24h Change</p>
                <p className="text-sm font-semibold text-emerald-600">+1.2%</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/trade"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Buy
              </Link>
              <Link
                to="/trade"
                className="rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Sell
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-400 text-center">
              Practice with virtual currency. No real risk.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Community</h3>
            <div className="mt-4 space-y-4">
              {["How do I start an IRA at 18?", "Student loans vs Investing?"].map(
                (post) => (
                  <div key={post} className="rounded-lg border border-slate-100 p-4">
                    <p className="text-sm font-semibold text-slate-900">{post}</p>
                    <p className="mt-1 text-xs text-slate-500">Posted by a learner</p>
                  </div>
                )
              )}
            </div>
            <Link
              to="/community"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View All Discussions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
