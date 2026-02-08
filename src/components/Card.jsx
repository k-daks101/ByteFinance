import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  );
}
