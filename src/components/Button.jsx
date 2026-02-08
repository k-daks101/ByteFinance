import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Button({ variant = "primary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900",
    outline:
      "border border-border bg-card text-foreground hover:bg-accent",
    ghost: "text-foreground hover:bg-accent",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      type="button"
      {...props}
    />
  );
}
