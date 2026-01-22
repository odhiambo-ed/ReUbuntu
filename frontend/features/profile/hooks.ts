"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "./keys";
import { fetchCurrentProfile, updateProfile } from "./api";
import type { UpdateProfileInput } from "./types";

export function useCurrentProfile(userId: string) {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => fetchCurrentProfile(userId),
    enabled: !!userId,
  });
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input, userId),
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.current(), data);
    },
  });
}
