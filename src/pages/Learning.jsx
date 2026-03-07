import { GraduationCap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const LESSON_QUIZZES = {
  "modern-money": [
    {
      question: "Which option is one of the three core functions of money?",
      options: ["Stock valuation", "Medium of exchange", "Government taxation", "Trade surplus"],
      correctIndex: 1,
      explanation:
        "Money acts as a medium of exchange, a store of value, and a unit of account.",
    },
    {
      question: "Modern fiat currency gets its value primarily from:",
      options: ["Gold reserves only", "Physical rarity", "Trust and social acceptance", "Weather patterns"],
      correctIndex: 2,
      explanation:
        "Fiat currency is valuable because governments and people accept and trust it in exchange.",
    },
    {
      question: "When central banks raise interest rates, the usual immediate effect is:",
      options: [
        "Borrowing gets cheaper",
        "Borrowing gets more expensive",
        "The money supply doubles",
        "All prices instantly fall",
      ],
      correctIndex: 1,
      explanation:
        "Higher rates raise borrowing costs, which slows spending and investment activity.",
    },
    {
      question: "Inflation means:",
      options: [
        "General decrease in prices",
        "General increase in prices",
        "No change in purchasing power",
        "A guaranteed rise in salaries",
      ],
      correctIndex: 1,
      explanation:
        "Inflation is a broad rise in prices over time, which reduces purchasing power.",
    },
    {
      question: "In periods of deflation, your money's purchasing power generally:",
      options: ["Increases", "Decreases", "Disappears", "Becomes fixed by law"],
      correctIndex: 0,
      explanation:
        "Deflation is falling general prices, so each unit of currency can buy more.",
    },
  ],
  "investing-basics": [
    {
      question: "Buying a stock gives you:",
      options: ["A loan contract", "Ownership (equity) in a company", "A fixed coupon payment", "Government backing"],
      correctIndex: 1,
      explanation:
        "Stocks represent equity ownership, so you own a slice of the company.",
    },
    {
      question: "A bond is best described as:",
      options: ["Ownership in a company", "A short-term savings account", "A loan to an issuer", "A stock split"],
      correctIndex: 2,
      explanation:
        "When you buy a bond, you are lending money to a government or corporation.",
    },
    {
      question: "Which investment usually has higher return potential and higher risk?",
      options: ["Government bonds", "Individual stocks", "Certificates of deposit", "Cash savings"],
      correctIndex: 1,
      explanation:
        "Stocks can deliver stronger growth but are generally more volatile than bonds.",
    },
    {
      question: "A common income source from bonds is:",
      options: ["Dividends", "Fixed interest payments", "Capital gains only", "Royalty rights"],
      correctIndex: 1,
      explanation:
        "Bonds typically pay periodic interest, often called coupon payments.",
    },
    {
      question: "When a bond reaches maturity, the investor typically receives:",
      options: ["A share certificate", "Only accrued interest", "The principal (face value)", "A new stock issue"],
      correctIndex: 2,
      explanation:
        "At maturity, bonds are generally repaid at principal (face value), barring default.",
    },
  ],
};

const LESSON_KEY_ALIASES = {
  "stocks-v-bonds": "investing-basics",
  "stocks-vs-bonds": "investing-basics",
  "inbvesting-basics": "investing-basics",
};

export default function Learning() {
  const [searchParams] = useSearchParams();
  const [selectedLesson, setSelectedLesson] = useState("modern-money");
  const [lessonProgress, setLessonProgress] = useState({
    "modern-money": 0,
    "investing-basics": 0,
  });
  const [lessonQuizState, setLessonQuizState] = useState(() => {
    const state = {};

    Object.entries(LESSON_QUIZZES).forEach(([lessonKey, questions]) => {
      state[lessonKey] = {
        currentQuestionIndex: 0,
        answers: Array(questions.length).fill(null),
      };
    });

    return state;
  });

  const modernMoneySectionRef = useRef(null);
  const investingBasicsSectionRef = useRef(null);
  const modernMoneyQuizRef = useRef(null);
  const investingBasicsQuizRef = useRef(null);

  const updateLessonProgress = useCallback(() => {
    const activeRef =
      selectedLesson === "modern-money"
        ? modernMoneySectionRef
        : investingBasicsSectionRef;

    if (!activeRef.current) {
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const sectionTop = activeRef.current.offsetTop;
    const sectionHeight = activeRef.current.offsetHeight;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const maxScrollableDistance = Math.max(sectionHeight - viewportHeight, 0);

    let progress = 0;

    if (maxScrollableDistance === 0) {
      progress = scrollTop >= sectionTop ? 100 : 0;
    } else {
      const scrolledDistance = scrollTop - sectionTop;
      const rawProgress = (scrolledDistance / maxScrollableDistance) * 100;
      progress = Math.round(Math.min(Math.max(rawProgress, 0), 100));
    }

    setLessonProgress((prev) => {
      if (prev[selectedLesson] === progress) {
        return prev;
      }

      return {
        ...prev,
        [selectedLesson]: progress,
      };
    });
  }, [selectedLesson]);

  useEffect(() => {
    updateLessonProgress();

    window.addEventListener("scroll", updateLessonProgress, { passive: true });
    window.addEventListener("resize", updateLessonProgress);

    return () => {
      window.removeEventListener("scroll", updateLessonProgress);
      window.removeEventListener("resize", updateLessonProgress);
    };
  }, [updateLessonProgress]);

  const scrollToQuiz = useCallback((lessonKey) => {
    const quizRef = lessonKey === "modern-money" ? modernMoneyQuizRef : investingBasicsQuizRef;
    quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const lessonFromUrl = searchParams.get("lesson");
    const normalizedLesson = LESSON_KEY_ALIASES[lessonFromUrl] || lessonFromUrl;

    if (normalizedLesson && LESSON_QUIZZES[normalizedLesson] && normalizedLesson !== selectedLesson) {
      setSelectedLesson(normalizedLesson);
    }
  }, [searchParams, selectedLesson]);

  const selectQuizAnswer = useCallback((lessonKey, answerIndex) => {
    setLessonQuizState((prev) => {
      const lessonState = prev[lessonKey];
      const nextAnswers = [...lessonState.answers];
      nextAnswers[lessonState.currentQuestionIndex] = answerIndex;

      return {
        ...prev,
        [lessonKey]: {
          ...lessonState,
          answers: nextAnswers,
        },
      };
    });
  }, []);

  const moveQuizQuestion = useCallback((lessonKey, direction) => {
    setLessonQuizState((prev) => {
      const lessonState = prev[lessonKey];
      const maxIndex = LESSON_QUIZZES[lessonKey].length - 1;
      const nextIndex = Math.min(Math.max(lessonState.currentQuestionIndex + direction, 0), maxIndex);

      if (nextIndex === lessonState.currentQuestionIndex) {
        return prev;
      }

      return {
        ...prev,
        [lessonKey]: {
          ...lessonState,
          currentQuestionIndex: nextIndex,
        },
      };
    });
  }, []);

  const renderQuizSidebar = (lessonKey, quizRef) => {
    const quizQuestions = LESSON_QUIZZES[lessonKey];
    const lessonState = lessonQuizState[lessonKey];
    const activeQuestion = quizQuestions[lessonState.currentQuestionIndex];
    const selectedAnswer = lessonState.answers[lessonState.currentQuestionIndex];
    const answeredCount = lessonState.answers.filter((answer) => answer !== null).length;
    const correctCount = lessonState.answers.reduce((count, answer, index) => {
      if (answer === null) {
        return count;
      }

      return answer === quizQuestions[index].correctIndex ? count + 1 : count;
    }, 0);
    const accuracy = answeredCount > 0 ? `${Math.round((correctCount / answeredCount) * 100)}%` : "-";

    return (
      <aside className="lg:sticky lg:top-8 space-y-6">
        <div className="bf-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-foreground">Knowledge Check</h3>
            <span className="text-sm text-muted-foreground">
              Question {lessonState.currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
          </div>
        </div>

        <div ref={quizRef} className="bf-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">{activeQuestion.question}</h3>
          <p className="text-sm text-muted-foreground mb-6">Select the best answer below.</p>

          <div className="space-y-3">
            {activeQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const hasAnswered = selectedAnswer !== null;
              const isCorrect = index === activeQuestion.correctIndex;
              const optionStateClass = hasAnswered
                ? isCorrect
                  ? "border-emerald-500 bg-emerald-50"
                  : isSelected
                  ? "border-rose-500 bg-rose-50"
                  : "border-border bg-card"
                : "border-border bg-card hover:border-indigo-400 hover:shadow-sm";

              return (
                <button
                  key={option}
                  onClick={() => selectQuizAnswer(lessonKey, index)}
                  className={`bf-btn-interactive w-full text-left p-4 rounded-lg border-2 ${optionStateClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected ? "border-indigo-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground">{option}</span>
                        {hasAnswered && isCorrect && (
                          <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                            CORRECT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="mt-4 p-4 rounded-lg border border-indigo-100 bg-indigo-50">
              <p className="text-sm text-foreground/80">{activeQuestion.explanation}</p>
              {selectedAnswer !== activeQuestion.correctIndex && (
                <p className="text-sm font-medium text-foreground mt-2">
                  Correct answer: {activeQuestion.options[activeQuestion.correctIndex]}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <button
              onClick={() => moveQuizQuestion(lessonKey, -1)}
              disabled={lessonState.currentQuestionIndex === 0}
              className="bf-btn-interactive inline-flex items-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              onClick={() => moveQuizQuestion(lessonKey, 1)}
              disabled={lessonState.currentQuestionIndex === quizQuestions.length - 1}
              className="bf-btn-interactive bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md shadow-sm disabled:opacity-40"
            >
              {lessonState.currentQuestionIndex === quizQuestions.length - 1 ? "Quiz Complete" : "Next Question →"}
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
              <div className="text-3xl font-bold text-indigo-600">
                {correctCount}/{quizQuestions.length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-400">{accuracy}</div>
            </div>
          </div>
        </div>
      </aside>
    );
  };

  return (
    <div className="space-y-8">
      {/* Lesson Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setSelectedLesson("modern-money")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            selectedLesson === "modern-money"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Modern Money Mechanics
        </button>
        <button
          onClick={() => setSelectedLesson("investing-basics")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            selectedLesson === "investing-basics"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Investing Basics: Stocks v Bonds
        </button>
      </div>

      {/* Modern Money Mechanics Lesson */}
      {selectedLesson === "modern-money" && (
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <section ref={modernMoneySectionRef} className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            <GraduationCap className="h-4 w-4" />
            ← MODULE 1: MODERN MONEY MECHANICS
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Modern Money Mechanics: How Currency Works
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Understand the foundations of money, economic forces that shape financial markets, and how central banks
              influence inflation and deflation. Master the mechanics that drive global economies and affect your wealth.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Lesson Progress</span>
              <span className="text-sm font-semibold text-foreground">{lessonProgress["modern-money"]}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded">
              <div
                className="h-2 bg-indigo-600 rounded"
                style={{ width: `${lessonProgress["modern-money"]}%` }}
              />
            </div>
          </div>

          <div className="bf-divider" />

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">What Is Money?</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Money is more than just coins and paper bills. It's a system of exchange that allows economies to function efficiently.
              Throughout history, humans have used various forms of money: from bartering goods, to using precious metals like gold and silver,
              to today's fiat currency (money backed by government decree rather than physical commodities).
            </p>

            <div className="bg-indigo-50 border border-indigo-100 p-4 mb-4 rounded-lg bf-card-hover">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                  💵
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mentor Tip</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Modern money derives its value from trust and acceptance. Unlike gold which has intrinsic value,
                    fiat currency works because governments and people agree it has value. When that trust breaks down, so does the currency.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-3">Money serves three critical functions:</p>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <div>
                  <span className="font-semibold text-foreground">Medium of Exchange:</span>
                  <span className="text-foreground/80"> Money facilitates transactions between buyers and sellers, replacing the inefficiency of bartering.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <div>
                  <span className="font-semibold text-foreground">Store of Value:</span>
                  <span className="text-foreground/80"> You can save money today and use it in the future without significant loss of purchasing power (ideally).</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                <div>
                  <span className="font-semibold text-foreground">Unit of Account:</span>
                  <span className="text-foreground/80"> Money provides a standard measure for pricing goods and services, making comparisons easy.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bf-divider" />

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Central Banking & Monetary Policy</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Central banks (like the Federal Reserve in the US) control the money supply and interest rates to manage economic growth
              and inflation. By adjusting these levers, central banks influence how much money circulates in the economy, which directly
              affects prices, employment, and investment returns.
            </p>

            <div className="bg-card border border-border p-4 mb-4 rounded-lg bf-card-hover">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  🏦
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Concepts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-foreground">Inflation</p>
                        <p className="text-muted-foreground">General increase in prices over time, reducing purchasing power</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Deflation</p>
                        <p className="text-muted-foreground">Decrease in prices, which can indicate economic contraction</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="font-semibold text-foreground">Interest Rates</p>
                        <p className="text-muted-foreground">Percentage charged for borrowing money; central banks set baseline rates</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Money Supply</p>
                        <p className="text-muted-foreground">Total amount of money circulating in the economy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg bf-card-hover">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                  ⚡
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mentor Tip</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    When central banks raise interest rates, borrowing becomes more expensive (slowing economic growth and inflation).
                    When they lower rates, borrowing becomes cheaper (stimulating economic activity). Understanding these cycles helps
                    you make better investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bf-divider" />

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Economic Forces: Inflation vs. Deflation</h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Aspect</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Inflation</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Deflation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground/80">Definition</td>
                    <td className="py-3 px-4 text-foreground/80">General rise in price levels across the economy</td>
                    <td className="py-3 px-4 text-foreground/80">General fall in price levels across the economy</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground/80">Your Money's Value</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-rose-100 text-rose-700">
                        Decreases
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                        Increases
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground/80">Borrowing</td>
                    <td className="py-3 px-4 text-foreground/80">Easier (you repay with less valuable money)</td>
                    <td className="py-3 px-4 text-foreground/80">Harder (you repay with more valuable money)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-foreground/80">Central Bank Action</td>
                    <td className="py-3 px-4 text-foreground/80">Raise interest rates to cool economy</td>
                    <td className="py-3 px-4 text-foreground/80">Lower interest rates to stimulate economy</td>
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
            <button
              onClick={() => scrollToQuiz("modern-money")}
              className="bf-btn-interactive bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-md shadow-sm"
            >
              → Start Quiz
            </button>
          </div>
        </section>

        {renderQuizSidebar("modern-money", modernMoneyQuizRef)}
      </div>
      )}

      {/* Investing Basics: Stocks vs. Bonds Lesson */}
      {selectedLesson === "investing-basics" && (
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <section ref={investingBasicsSectionRef} className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            <GraduationCap className="h-4 w-4" />
            ← MODULE 2: INVESTING BASICS
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Understanding Stocks v Bonds
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Learn the fundamental differences between equity and debt investments, and discover how to build a balanced
              portfolio that matches your risk tolerance.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Lesson Progress</span>
              <span className="text-sm font-semibold text-foreground">{lessonProgress["investing-basics"]}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded">
              <div
                className="h-2 bg-indigo-600 rounded"
                style={{ width: `${lessonProgress["investing-basics"]}%` }}
              />
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
                  📈
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
            <button
              onClick={() => scrollToQuiz("investing-basics")}
              className="bf-btn-interactive bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-md shadow-sm"
            >
              → Start Quiz
            </button>
          </div>
        </section>

        {renderQuizSidebar("investing-basics", investingBasicsQuizRef)}
      </div>
      )}
    </div>
  );
}
