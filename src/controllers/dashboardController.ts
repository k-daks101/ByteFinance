import type { DashboardCard, DashboardSummary } from "../models/dashboard";

export const getDashboardSummary = (): DashboardSummary => ({
  title: "Dashboard",
  description: "Overview of your simulated trading activity.",
});

export const getDashboardCards = (): DashboardCard[] => [
  { label: "Virtual Balance", value: "$10,000.00", helper: "Simulation funds" },
  { label: "Open Trades", value: "3", helper: "Active positions" },
  { label: "Win Rate", value: "62%", helper: "Last 30 days" },
];
