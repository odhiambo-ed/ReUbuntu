"use client";

import React from "react";
import UploadView from "@/components/UploadView";
import { MOCK_UPLOADS } from "@/services/mockData";

export default function UploadPage() {
  return <UploadView uploads={MOCK_UPLOADS} />;
}
