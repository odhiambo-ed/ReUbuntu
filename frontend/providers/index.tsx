"use client";

import { Toaster } from "sonner";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";
import { LoadingProvider } from "@/contexts/LoadingContext";
import Spinner from "@/components/Spinner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <LoadingProvider>
        <AuthProvider>
          {children}
          <Spinner />
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </LoadingProvider>
    </QueryProvider>
  );
}
