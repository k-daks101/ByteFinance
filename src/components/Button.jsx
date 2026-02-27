import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Button({ variant = "primary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bf-btn-interactive disabled:opacity-60 cursor-pointer select-none";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md active:shadow-sm",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 shadow-sm hover:shadow-md active:shadow-sm",
    outline:
      "border border-border bg-card text-foreground hover:bg-accent hover:border-indigo-300",
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
