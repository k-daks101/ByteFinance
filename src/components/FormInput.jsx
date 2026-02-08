import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function FormInput({
  label,
  id,
  className,
  inputClassName,
  ...props
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label htmlFor={id} className="text-sm text-slate-600 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400",
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}
