import {
  Flame,
  MessageCircle,
  PenSquare,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Community() {
  const [expandedTrend, setExpandedTrend] = useState(null);
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [newPostText, setNewPostText] = useState("");
  const [postFeedback, setPostFeedback] = useState("");

  const trendingGuides = [
    {
      id: 1,
      title: "Budgeting for Students",
      focus: "Cash Flow",
      depth: [
        "Start with fixed essentials first: rent, transport, groceries, and tuition-related costs. Assign these before flexible categories.",
        "Use a weekly spending cap for non-essentials so small daily purchases do not quietly erase your monthly budget.",
        "Review monthly subscriptions and recurring charges every 30 days. Small cuts here often free up money for savings without changing your lifestyle much."
      ]
    },
    {
      id: 2,
      title: "Crypto vs Stocks",
      focus: "Risk Profile",
      depth: [
        "Stocks are ownership in businesses with long historical performance data, while crypto is a newer, higher-volatility asset class with different risk drivers.",
        "If you include crypto, treat it as a small satellite position rather than the core of your portfolio, especially in beginner stages.",
        "Build your core in diversified funds first, then add higher-risk assets only if your emergency fund and long-term plan are already in place."
      ]
    },
    {
      id: 3,
      title: "First Credit Card Tips",
      focus: "Credit Building",
      depth: [
        "Keep utilization low by using a small portion of your limit and paying before the statement date when possible.",
        "Never miss a payment. Payment history carries major weight in credit scoring and is the fastest way to damage a young credit profile.",
        "Use autopay for at least the minimum and track statement closing dates so you build credit safely while avoiding interest."
      ]
    },
    {
      id: 4,
      title: "Emergency Fund Goals",
      focus: "Financial Safety",
      depth: [
        "Build toward 3 to 6 months of essential expenses, but start with a smaller target like one month to create momentum.",
        "Keep emergency savings in a separate high-yield savings account so it is accessible but not mixed with daily spending.",
        "Define what counts as an emergency in advance to prevent dipping into the fund for non-urgent purchases."
      ]
    }
  ];

  const [discussionGuides, setDiscussionGuides] = useState([
    {
      id: 1,
      title: "How do I start an IRA at 18?",
      focus: "Retirement",
      depth: [
        "Start by choosing between a Roth IRA and Traditional IRA. Most students or first-job earners lean Roth because taxes are paid now, which can be valuable if your current income is lower.",
        "Confirm you have earned income, then open an IRA at a low-fee brokerage and automate monthly contributions into broad index funds.",
        "Use contribution consistency as your main advantage at 18. Time in the market matters more than trying to time the market."
      ]
    },
    {
      id: 2,
      title: "Student loans vs investing?",
      focus: "Debt",
      depth: [
        "Compare your loan interest rate to expected long-term investment returns. High-interest debt usually deserves faster payoff before aggressive investing.",
        "A balanced strategy works for many beginners: make required loan payments, capture employer retirement match, then allocate extra cash to either debt payoff or investing based on interest rate and risk tolerance.",
        "Build a basic emergency buffer first so you avoid taking on more debt when unexpected expenses happen."
      ]
    },
    {
      id: 3,
      title: "Best budgeting apps for beginners?",
      focus: "Budgeting",
      depth: [
        "Choose the budgeting method first, then the app: zero-based budgeting for control, 50/30/20 for simplicity, or envelope-style for spending discipline.",
        "Look for features that matter at the start: bank syncing, category rules, goal tracking, recurring bills, and clear weekly spending snapshots.",
        "The best app is the one you review consistently. A simple tool used weekly beats a complex tool you abandon after two weeks."
      ]
    }
  ]);

  const [challengeItems, setChallengeItems] = useState([
    {
      id: 1,
      title: "7-Day Budget Reset",
      challengeUrl: "https://www.habitica.com/",
      durationDays: 7,
      progressDays: 0,
      participants: 142,
      joined: false,
      lastCheckIn: null,
      rewardBadge: "Budget Builder"
    },
    {
      id: 2,
      title: "No-Spend Weekend",
      challengeUrl: "https://www.reddit.com/r/nobuy/",
      durationDays: 2,
      progressDays: 1,
      participants: 89,
      joined: true,
      lastCheckIn: null,
      rewardBadge: "Discipline Starter"
    },
    {
      id: 3,
      title: "Build an Emergency Fund",
      challengeUrl: "https://www.stockmarketgame.org/",
      durationDays: 14,
      progressDays: 4,
      participants: 205,
      joined: true,
      lastCheckIn: null,
      rewardBadge: "Safety Net Achiever"
    }
  ]);

  const todayKey = new Date().toISOString().split("T")[0];

  // Auto-suggest forum URL based on post content
  const suggestForumUrl = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("ira") || lowerText.includes("retirement") || lowerText.includes("401k")) {
      return "https://www.reddit.com/r/personalfinance/";
    }
    if (lowerText.includes("crypto") || lowerText.includes("bitcoin") || lowerText.includes("ethereum")) {
      return "https://www.reddit.com/r/CryptoCurrency/";
    }
    if (lowerText.includes("stock") || lowerText.includes("invest") || lowerText.includes("trading")) {
      return "https://www.reddit.com/r/investing/";
    }
    if (lowerText.includes("budget") || lowerText.includes("debt") || lowerText.includes("saving")) {
      return "https://www.reddit.com/r/personalfinance/";
    }
    if (lowerText.includes("credit card") || lowerText.includes("credit score")) {
      return "https://www.reddit.com/r/CRedit/";
    }
    if (lowerText.includes("student loan")) {
      return "https://www.reddit.com/r/StudentLoans/";
    }
    
    // Default general forum
    return "https://www.reddit.com/r/personalfinance/";
  };

  const handleJoinChallenge = (challengeId) => {
    setChallengeItems((prev) =>
      prev.map((challenge) => {
        if (challenge.id !== challengeId || challenge.joined) {
          return challenge;
        }

        return {
          ...challenge,
          joined: true,
          participants: challenge.participants + 1
        };
      })
    );
  };

  const handleDailyCheckIn = (challengeId) => {
    setChallengeItems((prev) =>
      prev.map((challenge) => {
        const alreadyCheckedIn = challenge.lastCheckIn === todayKey;
        const completed = challenge.progressDays >= challenge.durationDays;

        if (
          challenge.id !== challengeId ||
          !challenge.joined ||
          alreadyCheckedIn ||
          completed
        ) {
          return challenge;
        }

        return {
          ...challenge,
          progressDays: challenge.progressDays + 1,
          lastCheckIn: todayKey
        };
      })
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCommunityPosts = async () => {
      try {
        const posts = await api.get("/community/posts");

        if (!isMounted || !Array.isArray(posts) || posts.length === 0) {
          return;
        }

        const mappedPosts = posts.map((post) => ({
          id: post.id,
          title: post.title,
          focus: post.focus || "Community",
          forumUrl: post.forum_url,
          depth: [
            post.content,
            "Saved in the community feed."
          ]
        }));

        setDiscussionGuides((prev) => {
          const existingTitles = new Set(prev.map((item) => item.title.toLowerCase()));
          const uniquePosts = mappedPosts.filter(
            (item) => !existingTitles.has(item.title.toLowerCase())
          );

          return [...uniquePosts, ...prev];
        });
      } catch (error) {
        // Keep page usable if backend route is unavailable.
      }
    };

    fetchCommunityPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreatePost = async () => {
    const trimmedText = newPostText.trim();

    if (!trimmedText) {
      setPostFeedback("Write something before posting.");
      return;
    }

    const suggestedForumUrl = suggestForumUrl(trimmedText);

    const newPost = {
      id: Date.now(),
      title: trimmedText,
      focus: "Community",
      forumUrl: suggestedForumUrl,
      depth: [
        trimmedText,
        "This post was just created. Community replies will be shown here as this feature expands."
      ]
    };

    // Show the new post instantly in Latest Discussions.
    setDiscussionGuides((prev) => [newPost, ...prev]);
    setExpandedDiscussion(newPost.id);
    setNewPostText("");
    setPostFeedback("Posted successfully.");

    // Attempt persistence if a backend endpoint is available.
    try {
      await api.post("/community/posts", {
        title: trimmedText,
        content: trimmedText,
        focus: "Community",
        forum_url: suggestedForumUrl,
      });
      setPostFeedback("Posted and saved.");
    } catch (error) {
      setPostFeedback("Posted locally. Backend save is not configured yet.");
    }
  };

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
            <div className="space-y-3">
              {trendingGuides.map((topic) => {
                const isExpanded = expandedTrend === topic.id;

                return (
                  <div key={topic.id} className="rounded-lg border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedTrend(isExpanded ? null : topic.id)}
                      className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold text-foreground">{topic.title}</h3>
                          <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-muted-foreground">
                            {topic.focus}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{isExpanded ? "-" : "+"}</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Deep Dive
                        </p>
                        <div className="mt-3 space-y-3">
                          {topic.depth.map((point) => (
                            <p key={point} className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 leading-relaxed">
                              {point}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bf-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-foreground">Latest Discussions</h2>
            </div>
            <div className="space-y-3">
              {discussionGuides.map((topic) => {
                const isExpanded = expandedDiscussion === topic.id;

                return (
                  <div key={topic.id} className="rounded-lg border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedDiscussion(isExpanded ? null : topic.id)}
                      className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold text-foreground">{topic.title}</h3>
                          <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-muted-foreground">
                            {topic.focus}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{isExpanded ? "-" : "+"}</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Deep Dive
                        </p>
                        <div className="mt-3 space-y-3">
                          {topic.depth.map((point) => (
                            <p key={point} className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 leading-relaxed">
                              {point}
                            </p>
                          ))}
                        </div>
                        {topic.forumUrl && (
                          <div className="mt-4">
                            <a
                              href={topic.forumUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bf-btn-interactive inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Discuss on Forum →
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
              value={newPostText}
              onChange={(event) => {
                setNewPostText(event.target.value);
                if (postFeedback) {
                  setPostFeedback("");
                }
              }}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-slate-400"
            />
            {postFeedback && (
              <p className="text-xs text-muted-foreground">{postFeedback}</p>
            )}
            <button
              type="button"
              onClick={handleCreatePost}
              className="bf-btn-interactive w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm"
            >
              Create Post
            </button>
          </div>

          <div className="bf-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-bold text-foreground">Community Challenges</h3>
            </div>
            <div className="space-y-3">
              {challengeItems.map((challenge) => {
                const completed = challenge.progressDays >= challenge.durationDays;
                const progressPercent = Math.min(
                  Math.round((challenge.progressDays / challenge.durationDays) * 100),
                  100
                );
                const remainingDays = Math.max(challenge.durationDays - challenge.progressDays, 0);
                const checkedInToday = challenge.lastCheckIn === todayKey;

                return (
                  <div key={challenge.id} className="rounded-lg border border-border bg-slate-50 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{challenge.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {challenge.participants} joined
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          completed
                            ? "bg-emerald-100 text-emerald-700"
                            : challenge.joined
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {completed ? "Completed" : challenge.joined ? "In Progress" : "Not Joined"}
                      </span>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Progress: {challenge.progressDays}/{challenge.durationDays} days</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className={`h-2 rounded-full ${completed ? "bg-emerald-500" : "bg-indigo-600"}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        {completed
                          ? `Badge unlocked: ${challenge.rewardBadge}`
                          : `${remainingDays} day${remainingDays === 1 ? "" : "s"} left`}
                      </p>

                      <div className="flex items-center gap-2">
                        {!challenge.joined && (
                          <button
                            type="button"
                            onClick={() => handleJoinChallenge(challenge.id)}
                            className="bf-btn-interactive rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
                          >
                            Join
                          </button>
                        )}

                        {challenge.joined && !completed && (
                          <button
                            type="button"
                            onClick={() => handleDailyCheckIn(challenge.id)}
                            disabled={checkedInToday}
                            className={`bf-btn-interactive rounded-md px-3 py-1.5 text-xs font-semibold text-white ${
                              checkedInToday
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                          >
                            {checkedInToday ? "Checked In Today" : "Check In Today"}
                          </button>
                        )}

                        <a
                          href={challenge.challengeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bf-btn-interactive rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
                        >
                          Open Site
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: Check in daily to build momentum and unlock completion badges.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
