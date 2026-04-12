const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export const AUTH_SESSION_EVENT = "auth-session-changed";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  birthDate?: string | null;
}

export interface AuthSessionPayload {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
}

function dispatchAuthSessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function hasActiveSession() {
  return Boolean(getAccessToken());
}

export function saveSession(session: AuthSessionPayload) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);

  if (session.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }

  dispatchAuthSessionChange();
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  dispatchAuthSessionChange();
}

export function redirectToAuth() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname !== "/auth") {
    window.location.replace("/auth");
  }
}
