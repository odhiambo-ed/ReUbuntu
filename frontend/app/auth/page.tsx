"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthView from "@/components/AuthView";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  const errorMessage =
    error === "auth_callback_error"
      ? "Authentication failed. Please try again."
      : null;

  return <AuthView onSuccess={handleSuccess} errorMessage={errorMessage} />;
}
