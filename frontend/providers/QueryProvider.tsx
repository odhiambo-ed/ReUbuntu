"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: (failureCount, error: unknown) => {
          const status = getHttpStatus(error);
          if (typeof status === "number" && status >= 400 && status < 500)
            return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: (failureCount, error: unknown) => {
          const status = getHttpStatus(error);
          if (typeof status === "number" && status >= 400 && status < 500)
            return false;
          return failureCount < 1;
        },
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
