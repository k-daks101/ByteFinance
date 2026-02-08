import { Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border bg-card px-6 shadow-sm flex items-center justify-between">
        <div className="text-lg font-semibold">Admin Header</div>
        <ThemeToggle />
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
