import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../routes/index.tsx";
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthProvider } from "../context/AuthContext";

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <div className="flex-1">
              <AppRoutes />
            </div>
            <footer className="border-t border-primary bg-primary px-6 py-4 text-center text-xs text-primary-foreground font-bold backdrop-blur">
              Exclusively brought to you by the WiFi Money Group.
            </footer>
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
