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
    // always verify the session with the server whenever the route changes
    const restoreSession = async () => {
      try {
        const res = await API.get("/users/profile");

        const user = res.data?.user || res.data?.data?.user || res.data?.data;
        const profile = res.data?.profile;

        if (user) {
          // update redux in case it was cleared manually or stale
          dispatch(addUser({ user, profile, token: null }));
        } else {
          // if server returns no user, make sure state is clean
          dispatch(removeUser());
        }
      } catch (err) {
        console.error("Session restore failed", err);
        // on error (401, network issue etc.) clear state so routes will redirect
        dispatch(removeUser());
      } finally {
        setChecking(false);
      }
    };

    setChecking(true);
    restoreSession();
  }, [dispatch, location.pathname]);

  if (checking) return <div>Loading...</div>;

  if (!auth?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role protection
  if (role && auth.user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;