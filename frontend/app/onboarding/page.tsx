"use client";

import React from "react";
import { useRouter } from "next/navigation";
import OnboardingView from "@/components/OnboardingView";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return <OnboardingView onComplete={handleComplete} />;
}
