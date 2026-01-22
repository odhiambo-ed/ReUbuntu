"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuthView from "@/components/AuthView";

export default function AuthPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/onboarding");
  };

  return <AuthView onLogin={handleLogin} />;
}
