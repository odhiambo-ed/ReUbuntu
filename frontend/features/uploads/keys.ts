import type { UploadFilters } from "./types";

export const uploadKeys = {
  all: ["uploads"] as const,
  lists: () => [...uploadKeys.all, "list"] as const,
  list: (filters: UploadFilters) => [...uploadKeys.lists(), filters] as const,
  details: () => [...uploadKeys.all, "detail"] as const,
  detail: (id: number) => [...uploadKeys.details(), id] as const,
  errors: (uploadId: number) =>
    [...uploadKeys.all, "errors", uploadId] as const,
};
