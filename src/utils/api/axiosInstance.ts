import axios from "axios";
const BASE_URL = "https://node.automatedpricingtool.io:5000/api/v1/";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
const hasAlreadyRedirected = () =>
  sessionStorage.getItem("hasRedirected") === "true";
const setRedirected = () => sessionStorage.setItem("hasRedirected", "true");
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("UserLoginTokenApt");
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status || null;
    const token = localStorage.getItem("UserLoginTokenApt");
    // const requestUrl = error?.config?.url || "";
    console.error("API Error:", error?.response);

    if (
      (status === 401 || status === 403 || status === 500) &&
      !hasAlreadyRedirected()
    ) {
      setRedirected();
      if (token) {
        console.warn("Invalid token. Clearing and redirecting...");
        // localStorage.removeItem("UserLoginTokenApt");
      } else {
        console.warn("No token. Redirecting to login...");
      }
      // window.location.href = "/signin";
    }
    // if (status === 500) {
    //   localStorage.removeItem("UserLoginTokenApt");
    //   window.location.href = "/signin";
    // }
    return Promise.reject(error);
  }
);
export default axiosInstance;
