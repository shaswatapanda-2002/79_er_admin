// src/queries/settings.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeAdminPassword, getAdminProfile, updateAdminProfile } from "@/src/services/settings.service";

export const settingsKeys = {
  all: ["settings"] as const,
  profile: () => [...settingsKeys.all, "profile"] as const,
};

export function useAdminProfileQuery() {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: getAdminProfile,
  });
}

export function useUpdateAdminProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.profile() });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changeAdminPassword,
  });
}