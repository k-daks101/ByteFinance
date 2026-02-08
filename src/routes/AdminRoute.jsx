import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function AdminRoute() {
  const auth = useContext(AuthContext);
  const isAdmin = auth?.user?.role === "admin" || auth?.user?.isAdmin === true;

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
