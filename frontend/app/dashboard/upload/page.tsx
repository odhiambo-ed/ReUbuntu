"use client";

import React from "react";
import UploadView from "@/components/UploadView";
import { useUploads } from "@/features/uploads";
import { Loader2 } from "lucide-react";

export default function UploadPage() {
  const { data: uploadsData, isLoading } = useUploads({ page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const uploads = uploadsData?.data ?? [];

  return <UploadView uploads={uploads} />;
}
