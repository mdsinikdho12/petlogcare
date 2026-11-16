"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import LenisProvider from "@/components/providers/LenisProvider";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              if (
                error?.response?.status === 404 ||
                error?.response?.status === 403
              ) {
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
      <LenisProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.7)",
              boxShadow: "0 10px 40px rgba(1, 95, 160, 0.12)",
              color: "#06395F",
              borderRadius: "1rem",
              fontFamily: "var(--font-sans, sans-serif)",
            },
          }}
        />
      </LenisProvider>
    </QueryClientProvider>
  );
}
