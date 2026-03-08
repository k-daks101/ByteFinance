import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
  CandlestickChart,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
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
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    await auth?.logout();
    navigate("/login", { replace: true });
  };

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
          <div className="mt-auto px-4 pb-6 space-y-2">
            <ThemeToggle className="w-full" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full rounded-lg px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-800/60 hover:text-white transition"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
            {auth?.user && (
              <div className="px-3 py-2">
                <p className="text-sm font-bold text-white">
                  {auth.user.name || auth.user.email}
                </p>
                <p className="mt-1 text-xs text-indigo-200/80 leading-relaxed">
                  {auth.user.bio?.trim() || "No bio added yet."}
                </p>
              </div>
            )}
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
