import { GraduationCap } from "lucide-react";

export default function Learning() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            <GraduationCap className="h-4 w-4" />
            ← MODULE 2: INVESTING BASICS
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Understanding Stocks vs. Bonds
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Learn the fundamental differences between equity and debt investments, and discover how to build a balanced
              portfolio that matches your risk tolerance.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Lesson Progress</span>
              <span className="text-sm font-semibold text-foreground">84%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded">
              <div className="h-2 bg-indigo-600 rounded" style={{ width: "84%" }} />
            </div>
          </div>

          <div className="bf-divider" />

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">What Are Stocks?</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              A stock represents ownership in a company. When you buy a stock, you're purchasing a small piece of ownership
              in a company. This is called equity. As a shareholder, you have a claim on the company's assets and earnings.
            </p>

            <div className="bg-indigo-50 border border-indigo-100 p-4 mb-4 rounded-lg bf-card-hover">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                  ☀
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mentor Tip</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Think of stocks as owning a slice of pizza. If the pizza shop becomes more popular and valuable, your slice
                    becomes more valuable too. But if the shop struggles, your slice loses value.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-3">Stocks can generate returns in two ways:</p>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <div>
                  <span className="font-semibold text-foreground">Capital Appreciation:</span>
                  <span className="text-foreground/80"> The stock price increases over time, allowing you to sell for a profit.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <div>
                  <span className="font-semibold text-foreground">Dividends:</span>
                  <span className="text-foreground/80"> Some companies share profits with shareholders through regular dividend payments.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bf-divider" />

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">What Are Bonds?</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              A bond is essentially a loan you make to a government or corporation. In return, they promise to pay you back
              the principal amount plus interest over a set period. This makes bonds a form of debt investment.
            </p>

            <div className="bg-card border border-border p-4 mb-4 rounded-lg bf-card-hover">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  📄
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Bond Terms</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-foreground">Face Value</p>
                        <p className="text-muted-foreground">The amount it receives when the bond matures (typically $1,000)</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Coupon Rate</p>
                        <p className="text-muted-foreground">The annual interest rate paid to bondholders</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="font-semibold text-foreground">Maturity Date</p>
                        <p className="text-muted-foreground">When the bond expires and you get your principal back</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Yield</p>
                        <p className="text-muted-foreground">The return you earn, which can change based on market price</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg bf-card-hover">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                  ✦
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mentor Tip</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Bonds are generally safer than stocks because you are guaranteed to get your principal back (if you hold it
                    until the issuer doesn't default). However, the trade-off is a lower potential return compared to stocks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bf-divider" />

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Stocks vs. Bonds: The Key Differences</h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Feature</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Stocks</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Bonds</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground/80">Ownership</td>
                    <td className="py-3 px-4 text-foreground/80">Equity (you own part of the company)</td>
                    <td className="py-3 px-4 text-foreground/80">Debt (you're a lender)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground/80">Risk Level</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-rose-100 text-rose-700">
                        Higher
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                        Lower
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground/80">Return Potential</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                        Higher
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground/80">Lower but predictable</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-foreground/80">Income</td>
                    <td className="py-3 px-4 text-foreground/80">Dividends (not guaranteed)</td>
                    <td className="py-3 px-4 text-foreground/80">Fixed interest payments</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-indigo-600 border border-indigo-600 p-8 text-center rounded-lg bf-card-hover">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Test Your Knowledge?</h3>
            <p className="text-indigo-100 mb-6">
              Complete the quiz on the right to verify your understanding and move on to the next lesson!
            </p>
            <button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-md">
              → Start Quiz
            </button>
          </div>
        </section>

        <aside className="lg:sticky lg:top-8 space-y-6">
          <div className="bf-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-foreground">Knowledge Check</h3>
              <span className="text-sm text-muted-foreground">Question 3 of 5</span>
            </div>

            <div className="flex items-center justify-between mt-6">
              {[
                { label: "Read", status: "done" },
                { label: "Learn", status: "done" },
                { label: "Quiz", status: "active" },
                { label: "Review", status: "todo" },
                { label: "Complete", status: "todo" },
              ].map((step, index) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm overflow-hidden ${
                        step.status === "done"
                          ? "bg-emerald-500 text-white"
                          : step.status === "active"
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span className="flex items-center justify-center leading-none text-center">
                        {step.status === "done" ? "✓" : index + 1}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{step.label}</span>
                  </div>
                  {index < 4 && (
                    <div
                      className={`w-12 h-0.5 mb-6 ${
                        step.status === "done" ? "bg-emerald-500" : "bg-slate-100"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bf-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Which investment typically offers higher potential returns but also comes with greater risk?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Select the best answer below.</p>

            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-lg border-2 border-border bg-card hover:border-indigo-400 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Government Bonds</span>
                </div>
              </button>
              <button className="w-full text-left p-4 rounded-lg border-2 border-emerald-500 bg-emerald-50 hover:border-indigo-400 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Individual Stocks</span>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                        CORRECT
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      That's right! Individual stocks typically offer higher potential returns because you own part of the company.
                      However, they're riskier because stock prices can be quite unpredictable.
                    </p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-4 rounded-lg border-2 border-border bg-card hover:border-indigo-400 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Savings Account</span>
                </div>
              </button>
              <button className="w-full text-left p-4 rounded-lg border-2 border-border bg-card hover:border-indigo-400 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">Certificate of Deposit (CD)</span>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <button className="inline-flex items-center text-muted-foreground hover:text-foreground">
                ← Previous
              </button>
              <button className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md">
                Next Question →
              </button>
            </div>
          </div>

          <div className="bf-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Current Score</span>
              <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">2/2</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">100%</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
