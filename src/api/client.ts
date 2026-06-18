import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setTokens(access: string | null, refresh: string | null) {
  accessToken = access;
  refreshToken = refresh;
  if (access && refresh) {
    localStorage.setItem('dwr_tokens', JSON.stringify({ access, refresh }));
  } else {
    localStorage.removeItem('dwr_tokens');
  }
}

export function loadStoredTokens() {
  try {
    const raw = localStorage.getItem('dwr_tokens');
    if (raw) {
      const parsed = JSON.parse(raw) as { access: string; refresh: string };
      accessToken = parsed.access;
      refreshToken = parsed.refresh;
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('dwr_tokens');
}

export function getAccessToken() {
  return accessToken;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });
    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  } catch {
    clearTokens();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && refreshToken) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);
