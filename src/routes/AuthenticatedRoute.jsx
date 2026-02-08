import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function AuthenticatedRoute() {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
