import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/store/authStore";

// In browser environments (Vercel, custom domain, localhost), using relative "/api/v1"
// routes through the Next.js server-side API proxy (src/app/api/v1/[...path]/route.ts).
// This eliminates CORS blocks, sets the required Nginx Host header, and ensures
// flawless connectivity in production without requiring custom Vercel env configs.
export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // If NEXT_PUBLIC_API_URL is explicitly set to a custom relative proxy, honor it
    if (process.env.NEXT_PUBLIC_API_URL?.startsWith("/")) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    // Otherwise in the browser, always use the same-origin reverse proxy /api/v1
    return "/api/v1";
  }
  // Server-side / SSR / SSG direct access
  return process.env.NEXT_PUBLIC_API_URL || "https://petcarelog-api.lokmansarkar.com/api/v1";
};

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send httpOnly cookies (refreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle 401 Token Rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Avoid infinite loop if refresh-token or login itself returned 401
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt rotation via cookie
        const baseUrl = getApiBaseUrl();
        const { data } = await axios.post(
          `${baseUrl}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token expired or reuse/theft detected
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/login?session_expired=true";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
