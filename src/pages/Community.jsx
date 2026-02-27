import {
  Flame,
  MessageCircle,
  PenSquare,
  Trophy,
} from "lucide-react";

export default function Community() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-white shadow-sm bf-card-hover">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">Community Hub</h1>
        </div>
        <p className="mt-2 text-sm text-indigo-100 max-w-2xl">
          Ask questions, share wins, and learn together with the ByteFinance community.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="bf-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-foreground">Trending Topics</h2>
              </div>
              <button className="bf-btn-interactive text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View all
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Budgeting for Students",
                "Crypto vs Stocks",
                "First Credit Card Tips",
                "Emergency Fund Goals",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border bg-slate-50 px-4 py-3 text-sm text-foreground bf-card-hover"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bf-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-foreground">Latest Discussions</h2>
            </div>
            {[
              {
                title: "How do I start an IRA at 18?",
                author: "Sarah",
                time: "2h ago",
                replies: "12",
                tag: "Retirement",
              },
              {
                title: "Student loans vs investing?",
                author: "Mike",
                time: "5h ago",
                replies: "8",
                tag: "Debt",
              },
              {
                title: "Best budgeting apps for beginners?",
                author: "Tina",
                time: "1d ago",
                replies: "21",
                tag: "Budgeting",
              },
            ].map((post) => (
              <div key={post.title} className="rounded-lg border border-border p-4 bf-card-hover">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">
                    {post.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Posted by {post.author} • {post.replies} replies
                </p>
                <div className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-muted-foreground">
                  {post.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bf-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PenSquare className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-foreground">Start a discussion</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Share questions or insights with your peers.
            </p>
            <textarea
              rows={4}
              placeholder="What do you want to ask the community?"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-slate-400"
            />
            <button className="bf-btn-interactive w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm">
              Create Post
            </button>
          </div>

          <div className="bf-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-bold text-foreground">Community Challenges</h3>
            </div>
            <div className="space-y-3">
              {[
                "7‑Day Budget Reset",
                "No‑Spend Weekend",
                "Build an Emergency Fund",
              ].map((challenge) => (
                <div
                  key={challenge}
                  className="rounded-lg border border-border bg-slate-50 px-4 py-3 text-sm text-foreground bf-card-hover"
                >
                  {challenge}
                </div>
              ))}
            </div>
            <button className="bf-btn-interactive w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent">
              Join a Challenge
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
