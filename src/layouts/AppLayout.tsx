import { NavLink, Outlet } from "react-router-dom";
import {
  CandlestickChart,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import ByteFinanceLogo from "../components/ByteFinanceLogo";

const navItems = [
  { label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard },
  { label: "Learning", to: "/learning", Icon: GraduationCap },
  { label: "Trading", to: "/trading", Icon: CandlestickChart },
  { label: "Community", to: "/community", Icon: Users },
  { label: "Settings", to: "/settings", Icon: Settings },
];

export const AppLayout = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-indigo-900 text-indigo-100 sticky top-0 h-screen">
          <div className="p-6">
            <ByteFinanceLogo className="items-start" />
          </div>
          <nav className="px-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-800/60 hover:text-white"
                  }`
                }
              >
                <item.Icon className="mr-2 h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 px-4">
            <ThemeToggle className="w-full" />
          </div>
        </aside>
        <main className="flex-1 p-8 bg-[radial-gradient(800px_500px_at_20%_-10%,rgba(99,102,241,0.12),transparent),radial-gradient(700px_400px_at_80%_-20%,rgba(16,185,129,0.10),transparent)]">
          <div className="max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
