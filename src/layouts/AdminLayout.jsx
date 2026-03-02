import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LogOut } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import AuthContext from "../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    await auth?.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border bg-card px-6 shadow-sm flex items-center justify-between">
        <div className="text-lg font-semibold">Admin Header</div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {auth?.user?.name || auth?.user?.email}
          </span>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>
      <nav className="border-b border-border bg-card/70 px-6 py-3 text-sm text-muted-foreground">
        Admin Navigation
      </nav>
      <main className="px-6 py-8">
        <div className="max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
