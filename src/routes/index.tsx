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
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Settings from "../pages/Settings";
import Trade from "../pages/Trade";

export const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AuthenticatedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/trading" element={<Trade />} />
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
