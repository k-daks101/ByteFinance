import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import AdminRoute from "./AdminRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";
import Admin from "../pages/Admin";
import AdminInstruments from "../pages/AdminInstruments";
import AdminUsers from "../pages/AdminUsers";
import Community from "../pages/Community";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Learning from "../pages/Learning";
import Login from "../pages/Login";
import Market from "../pages/Market";
import NotFound from "../pages/NotFound";
import Portfolio from "../pages/Portfolio";
import Register from "../pages/Register";
import Settings from "../pages/Settings";
import Trade from "../pages/Trade";
import Transactions from "../pages/Transactions";

export const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthenticatedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/market" element={<Market />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/trading" element={<Trade />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/instruments" element={<AdminInstruments />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
