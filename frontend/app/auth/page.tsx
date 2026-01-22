"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthView from "@/components/AuthView";
import { useAuth } from "@/contexts/AuthContext";

function parseHashParams(hash: string) {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  return {
    error: params.get("error"),
    errorCode: params.get("error_code"),
    errorDescription: params.get("error_description"),
  };
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const error = searchParams.get("error");

  const [hashError, setHashError] = useState<
    ReturnType<typeof parseHashParams>
  >(() =>
    typeof window === "undefined"
      ? { error: null, errorCode: null, errorDescription: null }
      : parseHashParams(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => {
      setHashError(parseHashParams(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, router, user]);

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  const errorMessage = useMemo(() => {
    if (hashError.errorDescription) return hashError.errorDescription;
    if (error === "auth_callback_error") {
      return "Authentication failed. Please try again.";
    }
    return null;
  }, [error, hashError.errorDescription]);

  return <AuthView onSuccess={handleSuccess} errorMessage={errorMessage} />;
}
