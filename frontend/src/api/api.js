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

      console.error("API Error:", error.response.data);
      if (status === 401) {
        // clear any persisted authentication and redux state
        localStorage.removeItem("token");
        delete API.defaults.headers.common.Authorization;

        try {
          // import store dynamically to avoid circular deps
          const { default: store } = await import("../store/appStore");
          const { removeUser } = await import("../store/userSlice");
          store.dispatch(removeUser());
        } catch (e) {
          console.warn("Could not clear redux state on 401", e);
        }

        // only redirect if the failing request wasn't the simple profile check
        // (allow public pages such as /setup-account to complete)
        const url = error.config?.url || "";
        if (!url.includes("/users/profile")) {
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;