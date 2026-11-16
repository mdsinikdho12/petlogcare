# Frontend Guide 02: API Client, JWT Interceptors & Session Store

> **Branch / Goal:** Typed API Client with Automatic Token Rotation & Zustand Auth State  
> **Backend Integration:** `POST /auth/refresh-token`, `POST /auth/logout`, `GET /auth/me`

---

## 1. Overview of Authentication Protocol

The PetCareLog backend enforces **Refresh Token Rotation with Reuse Detection**:
1. Short-lived Access Token (15 min) sent via header: `Authorization: Bearer <accessToken>`.
2. Long-lived Refresh Token (7 days) saved in `httpOnly` cookie (`refreshToken`), plus returned in response body for non-cookie contexts.
3. When an API call returns `401 Unauthorized`:
   - Interceptor pauses incoming requests.
   - Calls `POST /api/v1/auth/refresh-token`.
   - On success: updates access token in memory & replays queued requests with the new token.
   - On failure (or token theft detection): clears state and redirects to `/login`.

---

## 2. Zustand Auth Store (`src/lib/store/authStore.ts`)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'USER' | 'PROVIDER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  profileImage?: { url: string; key: string };
  verified?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      setAccessToken: (token) =>
        set((state) => ({ ...state, accessToken: token })),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'petcarelog-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

---

## 3. Axios Client with Auto-Rotation Interceptor (`src/lib/api/client.ts`)

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send httpOnly cookies (refreshToken)
  headers: {
    'Content-Type': 'application/json',
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
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle 401 Token Rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Avoid infinite loop if refresh-token or login itself returned 401
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
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
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
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
        if (typeof window !== 'undefined') {
          window.location.href = '/login?session_expired=true';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 4. TanStack Query Configuration (`src/app/providers.tsx`)

```typescript
'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              if (error?.response?.status === 404 || error?.response?.status === 403) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 5. Next.js Role-Based Route Guard (`src/middleware.ts`)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/providers', '/blogs'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read refresh token or auth session cookie
  const hasRefreshToken = request.cookies.has('refreshToken');

  const isPublic = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!hasRefreshToken && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Dashboard role protection is further validated in layout components via useAuthStore
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```
