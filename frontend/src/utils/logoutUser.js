import { BASE_URL } from "./constants";
import { removeUser } from "../store/userSlice";
import { clearStudentProfile } from "../store/studentProfileSlice";
import API from "../api/api";

export const logoutUser = async (dispatch, navigate) => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;

  try {
    await API.post(BASE_URL + "/api/auth/logout", {}, { withCredentials: true });

    dispatch(removeUser());
    dispatch(clearStudentProfile());

    navigate("/login");
  } catch (err) {
    console.error(err);
  }
};