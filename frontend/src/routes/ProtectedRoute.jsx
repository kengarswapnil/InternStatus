import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import API from "../api/api";
import { addUser, removeUser } from "../store/userSlice";

const ProtectedRoute = ({ role, children }) => {

  const auth = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const [checking, setChecking] = useState(true);

  useEffect(() => {

    const restoreSession = async () => {

      try {

        const res = await API.get("/users/profile");

        const user =
          res.data?.user ||
          res.data?.data?.user ||
          res.data?.data;

        const profile = res.data?.profile;

        if (user) {
          dispatch(addUser({ user, profile, token: null }));
        } else {
          dispatch(removeUser());
        }

      } catch (err) {

        console.error("Session restore failed", err);
        dispatch(removeUser());

      } finally {
        setChecking(false);
      }

    };

    setChecking(true);
    restoreSession();

  }, [dispatch, location.pathname]);

  if (checking) {
    return <div>Loading...</div>;
  }

  if (!auth?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = auth.user.role;

  /* ---------- ROLE CHECK FIX ---------- */

  if (role) {

    // allow multiple roles
    if (Array.isArray(role)) {

      if (!role.includes(userRole)) {
        return <Navigate to="/" replace />;
      }

    } else {

      if (userRole !== role) {
        return <Navigate to="/" replace />;
      }

    }

  }

  return children ? children : <Outlet />;

};

export default ProtectedRoute;