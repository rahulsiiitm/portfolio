import { cookies } from "next/headers";

const ACCESS_COOKIE = "zero_control_access";
const REFRESH_COOKIE = "zero_control_refresh";

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("ZERO Control Room Supabase environment is not configured.");
  }

  return { url, publishableKey };
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/zero-control",
    maxAge,
  };
}

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: SupabaseAuthUser;
};

async function authFetch(path: string, init: RequestInit = {}) {
  const { url, publishableKey } = config();
  const headers = new Headers(init.headers);
  headers.set("apikey", publishableKey);
  headers.set("Content-Type", "application/json");

  return fetch(`${url}/auth/v1${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function signInAdmin(email: string, password: string) {
  const response = await authFetch("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) return { ok: false as const, status: 401 };

  const token = (await response.json()) as TokenResponse;
  if (token.user?.app_metadata?.role !== "zero_admin") {
    return { ok: false as const, status: 403 };
  }

  await storeSession(token);
  return { ok: true as const, user: token.user };
}

async function storeSession(token: TokenResponse) {
  const cookieStore = await cookies();
  cookieStore.set(
    ACCESS_COOKIE,
    token.access_token,
    cookieOptions(Math.max(60, token.expires_in ?? 3600)),
  );
  cookieStore.set(
    REFRESH_COOKIE,
    token.refresh_token,
    cookieOptions(60 * 60 * 24 * 30),
  );
}

async function fetchUser(accessToken: string) {
  const response = await authFetch("/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return null;
  return (await response.json()) as SupabaseAuthUser;
}

async function refreshSession(refreshToken: string) {
  const response = await authFetch("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) return null;
  const token = (await response.json()) as TokenResponse;
  await storeSession(token);
  return token;
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  let user = accessToken ? await fetchUser(accessToken) : null;
  if ((!accessToken || !user) && refreshToken) {
    const refreshed = await refreshSession(refreshToken);
    if (refreshed) {
      accessToken = refreshed.access_token;
      user = refreshed.user ?? (await fetchUser(accessToken));
    }
  }

  if (!accessToken || !user || user.app_metadata?.role !== "zero_admin") return null;
  return { user, accessToken };
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, "", cookieOptions(0));
  cookieStore.set(REFRESH_COOKIE, "", cookieOptions(0));
}

export async function supabaseData<T>(query: string, accessToken: string): Promise<T> {
  const { url, publishableKey } = config();
  const response = await fetch(`${url}/rest/v1/${query}`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase data request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}
