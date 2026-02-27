import React, { useState, useEffect } from "react";
import {
  User,
  Sliders,
  Target,
  Shield,
  Bell,
  Camera,
  Mail,
  FileText,
  Globe,
  Moon,
  Wallet,
  AlertCircle,
  Key,
  Smartphone,
  Save,
  ChevronRight,
} from "lucide-react";

const SECTIONS = [
  { id: "profile", label: "Profile", Icon: User },
  { id: "preferences", label: "Preferences", Icon: Sliders },
  { id: "goals", label: "Financial Goals", Icon: Target },
  { id: "security", label: "Security", Icon: Shield },
  { id: "notifications", label: "Notifications", Icon: Bell },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Preferences
  const [currency, setCurrency] = useState("GHS");
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);

  // Financial Goals
  const [monthlySavings, setMonthlySavings] = useState("");
  const [budgetAlertThreshold, setBudgetAlertThreshold] = useState("");

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notifications
  const [emailLargeTx, setEmailLargeTx] = useState(true);
  const [emailWeeklyReport, setEmailWeeklyReport] = useState(true);
  const [smsLargeTx, setSmsLargeTx] = useState(false);
  const [smsWeeklyReport, setSmsWeeklyReport] = useState(false);
  const [pushLargeTx, setPushLargeTx] = useState(true);
  const [pushWeeklyReport, setPushWeeklyReport] = useState(false);

  // Sync dark mode with existing theme
  useEffect(() => {
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const handleDarkModeToggle = (on) => {
    setDarkMode(on);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", on);
      localStorage.setItem("theme", on ? "dark" : "light");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, preferences, and security.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Sidebar / Top tab bar */}
        <nav
          className="flex shrink-0 flex-row gap-1 overflow-x-auto pb-2 lg:flex-col lg:w-56 lg:overflow-visible lg:pb-0"
          aria-label="Settings sections"
        >
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors whitespace-nowrap ${
                activeSection === id
                  ? "bg-indigo-600 text-white"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              <ChevronRight className="ml-auto h-4 w-4 lg:hidden" />
            </button>
          ))}
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Profile */}
          {activeSection === "profile" && (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                Profile
              </h2>
              <div className="bf-card p-6 space-y-6">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <div className="relative shrink-0">
                    <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-slate-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-1">
                  <label className="block">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                      <User className="h-4 w-4 text-slate-500" />
                      Name
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                      <Mail className="h-4 w-4 text-slate-500" />
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                      <FileText className="h-4 w-4 text-slate-500" />
                      Bio
                    </span>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A short bio..."
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                  </label>
                </div>
              </div>
            </section>
          )}

          {/* Preferences */}
          {activeSection === "preferences" && (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                Preferences
              </h2>
              <div className="bf-card p-6 space-y-6">
                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                    <Wallet className="h-4 w-4 text-slate-500" />
                    Currency
                  </span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="GHS">GHS</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </label>
                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                    <Globe className="h-4 w-4 text-slate-500" />
                    Language
                  </span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </label>
                <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Moon className="h-4 w-4 text-slate-500" />
                    Dark Mode
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={darkMode}
                    onClick={() => handleDarkModeToggle(!darkMode)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      darkMode ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        darkMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Financial Goals */}
          {activeSection === "goals" && (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                Financial Goals
              </h2>
              <div className="bf-card p-6 space-y-6">
                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                    <Target className="h-4 w-4 text-slate-500" />
                    Monthly savings target
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(e.target.value)}
                    placeholder="e.g. 500"
                    className="mt-1 w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </label>
                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                    <AlertCircle className="h-4 w-4 text-slate-500" />
                    Budget alert threshold
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={budgetAlertThreshold}
                    onChange={(e) => setBudgetAlertThreshold(e.target.value)}
                    placeholder="e.g. 80% of budget"
                    className="mt-1 w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Get notified when spending approaches this limit.
                  </p>
                </label>
              </div>
            </section>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                Security
              </h2>
              <div className="bf-card p-6 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Key className="h-4 w-4 text-slate-500" />
                    Change Password
                  </span>
                  <button
                    type="button"
                    className="bf-btn-interactive shrink-0 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Smartphone className="h-4 w-4 text-slate-500" />
                    Enable Two-Factor Authentication
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={twoFactorEnabled}
                    onClick={() => setTwoFactorEnabled((v) => !v)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      twoFactorEnabled
                        ? "bg-indigo-600"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                Notifications
              </h2>
              <div className="bf-card p-6 space-y-6">
                <p className="text-sm text-muted-foreground">
                  Choose how you want to be notified for large transactions and
                  weekly reports.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[320px] text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 text-left font-medium text-foreground">
                          Channel
                        </th>
                        <th className="py-3 text-left font-medium text-foreground">
                          Large Transactions
                        </th>
                        <th className="py-3 text-left font-medium text-foreground">
                          Weekly Reports
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="flex items-center gap-2 py-3 font-medium text-foreground">
                          <Mail className="h-4 w-4 text-slate-500" />
                          Email
                        </td>
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={emailLargeTx}
                            onChange={(e) => setEmailLargeTx(e.target.checked)}
                            className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={emailWeeklyReport}
                            onChange={(e) =>
                              setEmailWeeklyReport(e.target.checked)
                            }
                            className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-center gap-2 py-3 font-medium text-foreground">
                          <Bell className="h-4 w-4 text-slate-500" />
                          SMS
                        </td>
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={smsLargeTx}
                            onChange={(e) => setSmsLargeTx(e.target.checked)}
                            className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={smsWeeklyReport}
                            onChange={(e) =>
                              setSmsWeeklyReport(e.target.checked)
                            }
                            className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-center gap-2 py-3 font-medium text-foreground">
                          <Smartphone className="h-4 w-4 text-slate-500" />
                          Push
                        </td>
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={pushLargeTx}
                            onChange={(e) => setPushLargeTx(e.target.checked)}
                            className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="checkbox"
                            checked={pushWeeklyReport}
                            onChange={(e) =>
                              setPushWeeklyReport(e.target.checked)
                            }
                            className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky Save bar - always visible when scrolling */}
      <div className="sticky bottom-0 mt-10 flex flex-col-reverse gap-3 border-t border-border bg-background/95 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-end sm:pt-6">
        {saved && (
          <p className="text-sm text-emerald-600 font-medium sm:mr-4">
            Your preferences have been saved.
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="bf-btn-interactive inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
