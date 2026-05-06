const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const OPERATOR_KEY = "operator";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  operator?: { id: number; email: string; role: string };
};

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function persistAuth(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  if (tokens.operator) {
    localStorage.setItem(OPERATOR_KEY, JSON.stringify(tokens.operator));
  }
  document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=86400; samesite=lax`;
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(OPERATOR_KEY);
  document.cookie = "accessToken=; path=/; max-age=0; samesite=lax";
}
