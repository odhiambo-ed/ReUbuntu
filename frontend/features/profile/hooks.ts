"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "./keys";
import { fetchCurrentProfile, updateProfile } from "./api";
import type { UpdateProfileInput } from "./types";

export function useCurrentProfile() {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => fetchCurrentProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.current(), data);
    },
  });
}
