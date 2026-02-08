import React, { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      className={`rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent ${className}`}
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
