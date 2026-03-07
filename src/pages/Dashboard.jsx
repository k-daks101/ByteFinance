import { Link } from "react-router-dom";
import { LayoutDashboard, DollarSign, TrendingUp, PiggyBank, BookOpen, Clock, Award, LineChart, Users, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiBrief, setAiBrief] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [expandedCommunityPost, setExpandedCommunityPost] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        // Try to fetch dashboard data, or fallback to portfolio
        const data = await api.get("/dashboard").catch(async () => {
          // Fallback to portfolio if dashboard endpoint doesn't exist
          return await api.get("/portfolio").catch(() => null);
        });

        if (isMounted && data) {
          setDashboardData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Unable to load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const fetchAiBrief = async () => {
      try {
        if (isMounted) {
          setAiLoading(true);
          setAiError("");
        }

        const insight = await api.get("/daily-brief");

        if (isMounted) {
          setAiBrief(insight);
        }
      } catch (err) {
        console.error("AI Brief API Error:", err);
        
        // Fallback to mock data if API fails
        if (isMounted) {
          const mockInsight = {
            insight_date: new Date().toISOString().split('T')[0],
            sentiment: "Bullish",
            summary_text: "Tech sector rallies as AI adoption grows. Markets show positive momentum with inflation reports indicating promising decline. Oil prices stabilize after recent volatility, contributing to overall market confidence.",
            is_mock: true
          };
          
          setAiBrief(mockInsight);
          setAiError("Using demo data - backend API unavailable");
        }
      } finally {
        if (isMounted) {
          setAiLoading(false);
        }
      }
    };

    fetchDashboardData();
    fetchAiBrief();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchDashboardData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Extract data with fallbacks
  const cashBalance = dashboardData?.cashBalance ?? dashboardData?.cash ?? "$10,000.00";
  const totalValue = dashboardData?.portfolioValue ?? dashboardData?.totalValue ?? "$12,450.20";
  const todayPL = dashboardData?.todayPL ?? dashboardData?.todayProfitLoss ?? "-$120.50";
  const todayPLPercent = dashboardData?.todayPLPercent ?? "-1.2%";

  // Financial Literacy Levels
  const literacyLevels = {
    1: {
      title: "Money Fundamentals",
      description: "Understanding the basics of modern money and currency.",
      courses: [
        { label: "What is Fiat Money?", value: "100%", color: "bg-emerald-500" },
        { label: "Currency vs. Commodity Money", value: "75%", color: "bg-indigo-600" },
        { label: "Digital Payments Basics", value: "40%", color: "bg-indigo-600" },
      ]
    },
    2: {
      title: "Economic Forces",
      description: "Learn how inflation and interest rates affect your money.",
      courses: [
        { label: "Understanding Inflation", value: "100%", color: "bg-emerald-500" },
        { label: "Purchasing Power Impact", value: "85%", color: "bg-indigo-600" },
        { label: "Interest Rate Basics", value: "60%", color: "bg-indigo-600" },
      ]
    },
    3: {
      title: "Central Banking & Policy",
      description: "Discover how central banks control the money supply.",
      courses: [
        { label: "Role of Central Banks", value: "90%", color: "bg-emerald-500" },
        { label: "Monetary Policy Tools", value: "70%", color: "bg-indigo-600" },
        { label: "Federal Reserve System", value: "55%", color: "bg-indigo-600" },
      ]
    },
    4: {
      title: "Investment Fundamentals",
      description: "Begin your journey into stocks and bonds investing.",
      courses: [
        { label: "Stocks: Equity Ownership", value: "100%", color: "bg-emerald-500" },
        { label: "Bonds: Fixed Income", value: "80%", color: "bg-indigo-600" },
        { label: "Risk vs. Reward", value: "45%", color: "bg-indigo-600" },
      ]
    },
    5: {
      title: "Portfolio Mastery",
      description: "Master diversification and building balanced portfolios.",
      courses: [
        { label: "Asset Allocation Strategies", value: "95%", color: "bg-emerald-500" },
        { label: "Portfolio Diversification", value: "85%", color: "bg-indigo-600" },
        { label: "Risk Management Advanced", value: "70%", color: "bg-indigo-600" },
      ]
    }
  };

  const currentLevelData = literacyLevels[currentLevel];

  // Learning Lab Lessons
  const learningLessons = [
    {
      id: 1,
      lessonKey: "modern-money",
      title: "Modern Money Mechanics",
      description: "Understand how modern currency works, from fiat money to digital payments. Learn about inflation, interest rates, and central banking.",
      duration: "15 min",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      topics: ["Fiat Currency", "Inflation Basics", "Interest Rates", "Central Banks"],
      difficulty: "Beginner",
      completionRate: 0,
      keyPoints: [
        "What is fiat money and how it differs from commodity money",
        "How central banks control money supply",
        "Understanding inflation and its impact on purchasing power",
        "The role of interest rates in the economy"
      ]
    },
    {
      id: 2,
      lessonKey: "investing-basics",
      title: "Investing Basics: Stocks v Bonds",
      description: "Discover the fundamental differences between stocks and bonds, understand risk vs. reward, and learn how to build a balanced portfolio.",
      duration: "20 min",
      icon: TrendingUp,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      topics: ["Stock Markets", "Bond Markets", "Risk Management", "Diversification"],
      difficulty: "Beginner",
      completionRate: 0,
      keyPoints: [
        "Understanding equity ownership through stocks",
        "How bonds provide fixed income and stability",
        "Risk-reward tradeoffs in different asset classes",
        "Building a diversified investment portfolio"
      ]
    }
  ];

  // Quiz Questions
  const quizQuestions = [
    // Modern Money Mechanics (Questions 1-5)
    {
      question: "What is fiat money?",
      options: [
        "Money backed by gold or silver",
        "Currency that has value because the government declares it legal tender",
        "Digital cryptocurrency only"
      ],
      correctAnswer: 1,
      topic: "Modern Money Mechanics"
    },
    {
      question: "What is the primary role of a central bank?",
      options: [
        "To provide loans to individual consumers",
        "To control the money supply and implement monetary policy",
        "To issue credit cards to businesses"
      ],
      correctAnswer: 1,
      topic: "Modern Money Mechanics"
    },
    {
      question: "What happens when inflation increases?",
      options: [
        "The purchasing power of money increases",
        "The purchasing power of money decreases",
        "Interest rates always decrease"
      ],
      correctAnswer: 1,
      topic: "Modern Money Mechanics"
    },
    {
      question: "How do central banks typically control interest rates?",
      options: [
        "By printing more physical cash",
        "By adjusting the federal funds rate and reserve requirements",
        "By eliminating all bank fees"
      ],
      correctAnswer: 1,
      topic: "Modern Money Mechanics"
    },
    {
      question: "What distinguishes fiat money from commodity money?",
      options: [
        "Fiat money has intrinsic value from the material it's made of",
        "Fiat money derives value from government decree rather than intrinsic worth",
        "Fiat money can only be used domestically"
      ],
      correctAnswer: 1,
      topic: "Modern Money Mechanics"
    },
    // Investing Basics: Stocks vs. Bonds (Questions 6-10)
    {
      question: "What does buying a stock represent?",
      options: [
        "Lending money to a company",
        "Owning a share of the company",
        "Receiving guaranteed fixed returns"
      ],
      correctAnswer: 1,
      topic: "Stocks vs. Bonds"
    },
    {
      question: "What is the primary characteristic of bonds?",
      options: [
        "They provide ownership in a company",
        "They offer variable returns based on company performance",
        "They provide fixed income through interest payments"
      ],
      correctAnswer: 2,
      topic: "Stocks vs. Bonds"
    },
    {
      question: "Which investment typically carries higher risk?",
      options: [
        "Government bonds",
        "Stocks",
        "Savings accounts"
      ],
      correctAnswer: 1,
      topic: "Stocks vs. Bonds"
    },
    {
      question: "What is diversification in investing?",
      options: [
        "Putting all money in one stock",
        "Spreading investments across different assets to reduce risk",
        "Only investing in bonds"
      ],
      correctAnswer: 1,
      topic: "Stocks vs. Bonds"
    },
    {
      question: "What is a key advantage of bonds over stocks?",
      options: [
        "Unlimited growth potential",
        "More stable and predictable returns",
        "Higher long-term returns"
      ],
      correctAnswer: 1,
      topic: "Stocks vs. Bonds"
    }
  ];

  // Frequently Asked Questions
  const faqItems = [
    {
      id: 1,
      question: "How do I start an IRA at 18?",
      answers: [
        "You can usually choose between a Traditional IRA and a Roth IRA. Many beginners at a lower tax bracket prefer Roth for potential tax-free withdrawals later.",
        "You need earned income to contribute to an IRA. Open one through a brokerage and start with diversified, low-cost index funds.",
        "Small, consistent contributions can still compound meaningfully over time."
      ]
    },
    {
      id: 2,
      question: "Student loans vs Investing?",
      answers: [
        "A practical rule: prioritize faster repayment when debt interest is high, and prioritize investing more when debt interest is relatively low.",
        "A balanced strategy is to make required loan payments while still capturing employer retirement match if available.",
        "Review your cash flow and risk tolerance before deciding how aggressive to be on either side."
      ]
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Save the answer
    const newAnswers = [...userAnswers, {
      questionIndex: currentQuestionIndex,
      selectedAnswer: selectedAnswer,
      correct: selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer
    }];
    setUserAnswers(newAnswers);

    // Move to next question or complete quiz
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setQuizCompleted(false);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const correctAnswersCount = userAnswers.filter(a => a.correct).length;
  const quizScore = quizCompleted ? Math.round((correctAnswersCount / quizQuestions.length) * 100) : 0;

  const refreshAiBrief = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      const insight = await api.get("/daily-brief");
      setAiBrief(insight);
    } catch (err) {
      console.error("AI Brief Refresh Error:", err);
      
      // Fallback to mock data if API fails
      const mockInsight = {
        insight_date: new Date().toISOString().split('T')[0],
        sentiment: "Bullish",
        summary_text: "Tech sector rallies as AI adoption grows. Markets show positive momentum with inflation reports indicating promising decline. Oil prices stabilize after recent volatility, contributing to overall market confidence.",
        is_mock: true
      };
      
      setAiBrief(mockInsight);
      setAiError("Using demo data - backend API unavailable");
    } finally {
      setAiLoading(false);
    }
  };

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
            <button className="bf-btn-interactive rounded-full bg-white px-4 py-1.5 text-xs font-medium text-indigo-700 shadow-sm">
              BASIC
            </button>
            <button className="bf-btn-interactive rounded-full px-4 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50">
              ADVANCED
            </button>
          </div>
          <button className="bf-btn-interactive h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
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
            className="bf-btn-interactive inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-slate-50"
          >
            Start Today&apos;s Lesson →
          </Link>
        </div>
      </section>

      <section className="bf-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Daily AI Market Brief</h2>
            <p className="text-sm text-slate-500">
              {aiBrief?.is_mock 
                ? "Demo data - Start backend to see live AI insights" 
                : "Generated by your backend OpenAI endpoint"}
            </p>
          </div>
          <button
            onClick={refreshAiBrief}
            disabled={aiLoading}
            className={`bf-btn-interactive rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 ${
              aiLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {aiLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Date</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {aiLoading ? "Loading..." : aiBrief?.insight_date || new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Sentiment</p>
            <p className={`mt-1 text-sm font-semibold ${
              aiBrief?.sentiment === 'Bullish' ? 'text-emerald-600' :  
              aiBrief?.sentiment === 'Bearish' ? 'text-rose-600' : 
              'text-slate-900'
            }`}>
              {aiLoading ? "Loading..." : aiBrief?.sentiment || "Neutral"}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 p-4 sm:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${
                aiError && aiBrief?.is_mock ? 'bg-amber-400' : 
                aiError ? 'bg-rose-500' : 
                aiLoading ? 'bg-blue-500' : 
                'bg-emerald-500'
              }`} />
              <p className="text-sm font-semibold text-slate-900">
                {aiError && aiBrief?.is_mock ? "Demo Mode" : 
                 aiError ? "Unavailable" : 
                 aiLoading ? "Fetching" : 
                 "Live"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-100 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Summary</p>
          <p className="mt-2 text-sm text-slate-700 leading-6">
            {aiLoading
              ? "Loading AI insight..."
              : aiBrief?.summary_text || "No summary available."}
          </p>
          {aiBrief?.is_mock && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-800">
                💡 <strong>Demo Mode:</strong> This is sample data. To see live AI-generated insights:
                <br />1. Ensure your Laravel backend is running (php artisan serve)
                <br />2. Run migrations (php artisan migrate)
                <br />3. Add OPENAI_API_KEY to your .env file (optional)
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              title: "Cash Balance", 
              value: loading ? "Loading..." : cashBalance, 
              note: "Virtual Currency",
              icon: DollarSign,
              iconBg: "bg-emerald-100",
              iconColor: "text-emerald-600"
            },
            { 
              title: "Total Value", 
              value: loading ? "Loading..." : totalValue, 
              note: dashboardData?.totalValueChange || "+24.5%",
              icon: TrendingUp,
              iconBg: "bg-indigo-100",
              iconColor: "text-indigo-600"
            },
            { 
              title: "Today's P/L", 
              value: loading ? "Loading..." : todayPL, 
              note: todayPLPercent,
              icon: PiggyBank,
              iconBg: "bg-purple-100",
              iconColor: "text-purple-600"
            },
          ].map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.title}
                className="bf-card bf-card-hover p-6 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500">{card.title}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
                    <p className="mt-2 text-xs text-slate-400">{card.note}</p>
                  </div>
                  <div className={`${card.iconBg} ${card.iconColor} rounded-lg p-2.5`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bf-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Financial Literacy</h3>
            <span className="text-sm text-indigo-600">Level {currentLevel}</span>
          </div>
          
          {/* Level Navigation Pills */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setCurrentLevel(level)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  currentLevel === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                L{level}
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-900">{currentLevelData.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {currentLevelData.description}
            </p>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {currentLevelData.courses.map((item) => (
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
            className="bf-btn-interactive mt-5 block rounded-lg bg-indigo-50 px-4 py-2 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          >
            View Full Curriculum
          </Link>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">The Learning Lab</h2>
                <p className="text-xs text-slate-500">Master financial literacy step by step</p>
              </div>
            </div>
            <Link to="/learning" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All Lessons
              <span className="text-xs">→</span>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {learningLessons.map((lesson) => {
              const IconComponent = lesson.icon;
              const isExpanded = expandedLesson === lesson.id;
              
              return (
                <div
                  key={lesson.id}
                  className="bf-card bf-card-hover p-5 group cursor-pointer transition-all duration-300"
                  onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                >
                  {/* Icon Header */}
                  <div className={`h-36 rounded-lg ${lesson.iconBg} mb-4 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
                    <IconComponent className={`h-20 w-20 ${lesson.iconColor} relative z-10 group-hover:scale-110 transition-transform duration-300`} />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        <BookOpen className="h-3 w-3" />
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {lesson.description}
                  </p>

                  {/* Topics Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lesson.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {topic}
                      </span>
                    ))}
                    {lesson.topics.length > 3 && (
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        +{lesson.topics.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Expandable Key Points Section */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-xs font-semibold text-slate-700 mb-2">📚 What You'll Learn:</p>
                      <ul className="space-y-2">
                        {lesson.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-indigo-500 mt-0.5">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/learning?lesson=${lesson.lessonKey}`}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Start Learning
                        <span>→</span>
                      </Link>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {lesson.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Award className="h-3.5 w-3.5" />
                      {lesson.completionRate}% Complete
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${lesson.iconColor.replace('text-', 'bg-')} transition-all duration-500`}
                      style={{ width: `${lesson.completionRate}%` }}
                    />
                  </div>

                  {/* Click Indicator */}
                  <p className="mt-2 text-center text-xs text-slate-400">
                    {isExpanded ? "Click to collapse" : "Click to expand"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bf-card p-6">
            {!quizCompleted ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Financial Literacy Quiz
                  </h3>
                  <span className="text-xs text-slate-500">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Topic Badge */}
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                    {currentQuestion.topic}
                  </span>
                </div>

                {/* Question */}
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  {currentQuestion.question}
                </p>

                {/* Answer Options */}
                <div className="mt-4 space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm transition-all ${
                        selectedAnswer === index
                          ? 'border-indigo-600 bg-indigo-50 text-slate-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-xs ${
                          selectedAnswer === index
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300'
                        }`}>
                          {selectedAnswer === index && '✓'}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all ${
                    selectedAnswer !== null
                      ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                      : 'bg-slate-300 cursor-not-allowed opacity-60'
                  }`}
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                </button>
              </>
            ) : (
              /* Quiz Results */
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  <Award className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Quiz Completed!</h3>
                <p className="mt-2 text-sm text-slate-600">
                  You've completed the Financial Literacy Quiz
                </p>

                {/* Score Display */}
                <div className="mt-6 p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                  <p className="text-sm font-medium text-slate-600">Your Score</p>
                  <p className="mt-2 text-4xl font-bold text-indigo-600">
                    {quizScore}%
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {correctAnswersCount} out of {quizQuestions.length} correct
                  </p>
                </div>

                {/* Performance Message */}
                <div className="mt-4 p-4 rounded-lg bg-slate-50">
                  <p className="text-sm font-semibold text-slate-900">
                    {quizScore >= 80 ? '🎉 Excellent Work!' : 
                     quizScore >= 60 ? '👍 Good Job!' : 
                     '💪 Keep Learning!'}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {quizScore >= 80 
                      ? 'You have a strong understanding of financial basics!' 
                      : quizScore >= 60 
                      ? 'You\'re on the right track. Review the lessons for better mastery.' 
                      : 'Consider reviewing the learning materials to improve your knowledge.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Retake Quiz
                  </button>
                  <Link
                    to="/learning"
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 inline-flex items-center justify-center gap-2"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Market Simulator</h3>
              </div>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                SAFE MODE
              </span>
            </div>
            <div className="mt-4 h-40 rounded-lg bg-gradient-to-br from-indigo-50 to-slate-50 relative overflow-hidden border border-slate-100">
              {/* Simple Chart Visualization */}
              <div className="absolute inset-0 flex items-end justify-around p-4">
                {[65, 72, 68, 75, 82, 78, 85, 88, 92, 95].map((height, i) => (
                  <div
                    key={i}
                    className="w-full mx-0.5 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t opacity-80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              {/* Overlay Label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600">Last 10 Trading Days</p>
                  <p className="text-lg font-bold text-emerald-600 text-center">+12.5%</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">S&P 500 ETF</p>
                <p className="text-lg font-semibold text-slate-900">
                  {loading ? "Loading..." : dashboardData?.marketPrice || "$412.50"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">24h Change</p>
                <p className={`text-sm font-semibold ${
                  dashboardData?.marketChange?.startsWith("-") ? "text-rose-600" : "text-emerald-600"
                }`}>
                  {loading ? "..." : dashboardData?.marketChange || "+1.2%"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/trade"
                className="bf-btn-interactive rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm"
              >
                Buy
              </Link>
              <Link
                to="/trade"
                className="bf-btn-interactive rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm"
              >
                Sell
              </Link>
            </div>
            <p className="mt-3 text-xs text-slate-400 text-center">
              Practice with virtual currency. No real risk.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-4">
              {faqItems.map((post) => {
                const isExpanded = expandedCommunityPost === post.id;
                
                return (
                  <div key={post.id} className="rounded-lg border border-slate-100 overflow-hidden transition-all">
                    <div 
                      className="p-4 hover:border-indigo-200 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedCommunityPost(isExpanded ? null : post.id)}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{post.question}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <span>{post.answers.length} answers</span>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 ml-2 flex-shrink-0">
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Answers Section */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1">
                          {post.answers.length} Suggested Answers
                        </p>
                        <div className="space-y-3">
                          {post.answers.map((answer, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-3 border border-slate-100">
                              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                                {answer}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Link
                          to="/community"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Browse all FAQs
                          <span>→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Link
              to="/community"
              className="bf-btn-interactive mt-4 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View All FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
