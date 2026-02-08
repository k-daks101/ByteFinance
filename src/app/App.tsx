import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../routes/index.tsx";
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthProvider } from "../context/AuthContext";

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
