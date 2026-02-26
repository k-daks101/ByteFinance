import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../routes/index.tsx";
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthProvider } from "../contexts/AuthContext";

const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

export const App = (): JSX.Element => {
  return (
    <BrowserRouter future={routerFutureFlags}>
      <ErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
