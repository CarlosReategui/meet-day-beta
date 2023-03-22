import { ApiWithoutToken } from "../axios-instance";
import jwtDecode from "jwt-decode";
import { TUserToken } from "../../types";
import { clientService } from "./client-service";

export const tokenService = {
  setTokensToLC: (data: string) => {
    localStorage.setItem("auth-tokens", JSON.stringify(data));
  },
  generateTokens: async (username: string, password: string) => {
    return clientService.token.post({ username, password });
  },
  refreshTokens: async () => {
    try {
      const response = await ApiWithoutToken.post("/api/token/refresh/", {
        refresh: tokenService.getTokenFromLC("refresh"),
      });
      tokenService.setTokensToLC(response.data);
    } catch {
      throw new Error("Refresh token has expired");
    }
  },
  getTokensFromLC: () => {
    return localStorage.getItem("auth-tokens");
  },
  getTokenFromLC: (type: "access" | "refresh") => {
    const authTokens = tokenService.getTokensFromLC();
    if (authTokens) {
      const parsedTokens = JSON.parse(authTokens);
      return parsedTokens[type];
    }
  },
  removeTokens: () => {
    localStorage.removeItem("auth-tokens");
  },
  accessTokenHasExpired: () => {
    const token = tokenService.getTokenFromLC("access");
    if (token) {
      const tokenInfo: TUserToken = jwtDecode(token);
      return tokenInfo.exp < Date.now() / 1000;
    }
    return true;
  },
};
