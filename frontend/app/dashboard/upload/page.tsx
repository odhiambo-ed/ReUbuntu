"use client";

import React from "react";
import UploadView from "@/components/UploadView";
import { useUploads } from "@/features/uploads";
import { UploadViewSkeleton } from "@/components/Skeletons";

export default function UploadPage() {
  const { data: uploadsData, isLoading } = useUploads({ page: 1, limit: 10 });

  if (isLoading) {
    return <UploadViewSkeleton />;
  }

  const uploads = uploadsData?.data ?? [];

  return <UploadView uploads={uploads} />;
}
