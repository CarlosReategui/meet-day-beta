import axios from "axios";
// import { BackendUrls } from "./backend-urls";
import { tokenService } from ".";

// const BASE_URL = "https://meet-day-beta.onrender.com/";
// const BASE_URL = "http://localhost:8000/";
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/"
    : "https://meet-day-beta.onrender.com/";

export const ApiWithToken = axios.create({
  baseURL: BASE_URL,
});

export const ApiWithoutToken = axios.create({
  baseURL: BASE_URL,
});

ApiWithToken.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getTokenFromLC("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ApiWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    try {
      const originalRequest = error.config;
      await tokenService.refreshTokens();
      return ApiWithToken(originalRequest);
    } catch {
      window.location.href = "/";
      tokenService.removeTokens();
      return Promise.reject(error);
    }
  }
);
