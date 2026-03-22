import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7777/api",
  withCredentials: true,
});

/* RESPONSE INTERCEPTOR */

API.interceptors.response.use(
  (response) => response,

  async (error) => {

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // 🔥 LOG ONLY IMPORTANT ERRORS
      if (status !== 404 && status !== 400) {
        console.error("API Error:", data || error.message);
      }

      // 🔐 HANDLE AUTH ERROR
      if (status === 401) {

        localStorage.removeItem("token");
        delete API.defaults.headers.common.Authorization;

        try {
          const { default: store } = await import("../store/appStore");
          const { removeUser } = await import("../store/userSlice");
          store.dispatch(removeUser());
        } catch (e) {
          console.warn("Redux clear failed:", e);
        }

        // avoid redirect loops
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

    } else {
      // 🌐 NETWORK ERROR
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;