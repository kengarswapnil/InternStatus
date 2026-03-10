import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import roleConfig from "../config/roleConfig";

const RoleRoute = ({ allowed, children }) => {
  const user = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  const userRole = String(user.role || "").toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) =>
    String(r).toLowerCase()
  );

  if (!normalizedAllowed.includes(userRole)) {
    const redirectTo = roleConfig[userRole] || "/";
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;