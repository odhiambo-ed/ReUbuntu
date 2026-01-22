"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentProfile } from "@/features/profile";

interface ProfileMetadata {
  company_name?: string;
  address?: string;
  [key: string]: unknown;
}

interface OnboardingGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function isOnboardingComplete(
  fullName: string | null | undefined,
  metadata: Record<string, unknown> | null | undefined,
): boolean {
  if (!fullName || fullName.trim() === "") {
    return false;
  }

  if (!metadata) {
    return false;
  }

  const typedMetadata = metadata as ProfileMetadata;

  if (!typedMetadata.company_name || typedMetadata.company_name.trim() === "") {
    return false;
  }

  if (!typedMetadata.address || typedMetadata.address.trim() === "") {
    return false;
  }

  return true;
}

export function OnboardingGuard({ children, fallback }: OnboardingGuardProps) {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useCurrentProfile();

  const onboardingComplete = isOnboardingComplete(
    profile?.full_name,
    profile?.metadata,
  );

  useEffect(() => {
    if (!isLoading && !isError && profile && !onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [isLoading, isError, profile, onboardingComplete, router]);

  if (isLoading) {
    return (
      fallback ?? (
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      )
    );
  }

  if (isError) {
    return null;
  }

  if (!onboardingComplete) {
    return (
      fallback ?? (
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      )
    );
  }

  return <>{children}</>;
}

export function useOnboardingStatus() {
  const { data: profile, isLoading, isError } = useCurrentProfile();

  const isComplete = isOnboardingComplete(
    profile?.full_name,
    profile?.metadata,
  );

  return {
    isLoading,
    isError,
    isComplete,
    profile,
    missingFields: !isLoading && profile ? getMissingFields(profile) : [],
  };
}

function getMissingFields(profile: {
  full_name: string | null;
  metadata: Record<string, unknown>;
}): string[] {
  const missing: string[] = [];

  if (!profile.full_name || profile.full_name.trim() === "") {
    missing.push("full_name");
  }

  const metadata = profile.metadata as ProfileMetadata;

  if (!metadata?.company_name || metadata.company_name.trim() === "") {
    missing.push("company_name");
  }

  if (!metadata?.address || metadata.address.trim() === "") {
    missing.push("address");
  }

  return missing;
}
