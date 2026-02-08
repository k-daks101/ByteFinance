import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export function Table({ className, ...props }) {
  return (
    <table
      className={cn(
        "w-full text-sm border-separate border-spacing-0 rounded-xl overflow-hidden border border-border bg-card text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <thead
      className={cn(
        "bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-300",
        className
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn("hover:bg-slate-50 dark:hover:bg-slate-900/40", className)}
      {...props}
    />
  );
}

export function TableHeaderCell({ className, ...props }) {
  return (
    <th
      className={cn("px-4 py-3 font-medium text-left border-b border-border", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("divide-y divide-slate-100 dark:divide-slate-800", className)} {...props} />;
}

export function TableCell({ className, ...props }) {
  return <td className={cn("px-4 py-3 text-slate-700 dark:text-slate-200", className)} {...props} />;
}
