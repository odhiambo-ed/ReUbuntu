"use client";

import React from "react";
import { useLoading } from "@/contexts/LoadingContext";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  show?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
  show,
}) => {
  const { isLoading } = useLoading();
  const shouldShow = show !== undefined ? show : isLoading;

  if (!shouldShow) return null;

  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div
        className={`animate-spin rounded-full border-solid border-teal-500 border-t-transparent ${sizeClasses[size]} ${className}`}
      />
    </div>
  );
};

export default Spinner;
