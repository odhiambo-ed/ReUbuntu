"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadKeys } from "./keys";
import {
  fetchUploads,
  fetchUpload,
  fetchUploadErrors,
  createUpload,
  uploadCsvFile,
  processUpload,
} from "./api";
import type { UploadFilters, CreateUploadInput } from "./types";

export function useUploads(filters: UploadFilters = {}) {
  return useQuery({
    queryKey: uploadKeys.list(filters),
    queryFn: () => fetchUploads(filters),
  });
}

export function useUpload(id: number) {
  return useQuery({
    queryKey: uploadKeys.detail(id),
    queryFn: () => fetchUpload(id),
    enabled: !!id,
  });
}

export function useUploadErrors(uploadId: number) {
  return useQuery({
    queryKey: uploadKeys.errors(uploadId),
    queryFn: () => fetchUploadErrors(uploadId),
    enabled: !!uploadId,
  });
}

export function useCreateUpload(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUploadInput) => createUpload(input, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
    },
  });
}

export function useUploadCsvFile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadCsvFile(file, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
    },
  });
}

export function useProcessUpload(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uploadId: number) => processUpload(uploadId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: uploadKeys.all });
    },
  });
}
