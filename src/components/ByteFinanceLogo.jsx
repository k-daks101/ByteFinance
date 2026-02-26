import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function ByteFinanceLogo({ className = "", markClassName = "" }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 48 48"
        className={cn("h-10 w-10", markClassName)}
        role="img"
        aria-label="ByteFinance logo"
      >
        <defs>
          <linearGradient id="bf-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#bf-gradient)" />
        <path
          d="M17 14h11c4 0 6 2 6 5 0 2-1 3.5-3 4.2 2.5.7 4 2.4 4 4.8 0 3.5-2.6 6-7 6H17V14zm6 8h4c2 0 3-1 3-2.5S29 17 27 17h-4v5zm0 11h5c2.2 0 3.4-1.1 3.4-2.8 0-1.8-1.2-2.7-3.4-2.7h-5V33z"
          fill="#ffffff"
        />
        <path
          d="M15 12h3v24h-3z"
          fill="rgba(255,255,255,0.75)"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-white">ByteFinance</span>
        <span className="text-[10px] uppercase tracking-widest text-indigo-200">
          Future Lab
        </span>
      </div>
    </div>
  );
}
