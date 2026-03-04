// src/services/settings.service.ts
import { apiGet, apiPut } from "@/lib/http/client";
import { ENDPOINTS } from "@/src/api/endpoints";

export type AdminProfile = {
  _id: string;
  fullName: string;
  email: string;
  countryCode?: string;
  mobile?: string;
  avatarUrl?: string;
  role?: string;
};

export type ProfileRes = {
  success: boolean;
  data: AdminProfile;
};

export type UpdateProfileRes = {
  success: boolean;
  message: string;
  data: AdminProfile;
};

export type ChangePasswordRes = {
  success: boolean;
  message: string;
};

export async function getAdminProfile() {
  return apiGet<ProfileRes>(ENDPOINTS.SETTINGS.PROFILE);
}

/**
 * Backend allows only: fullName + profileImage
 * We'll send FormData if file exists.
 */
export async function updateAdminProfile(input: { fullName: string; profileImage?: File | null }) {
  const fd = new FormData();
  fd.append("fullName", input.fullName);
  if (input.profileImage) fd.append("profileImage", input.profileImage);

  return apiPut<UpdateProfileRes>(ENDPOINTS.SETTINGS.PROFILE, fd);
}

export async function changeAdminPassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return apiPut<ChangePasswordRes>(ENDPOINTS.SETTINGS.CHANGE_PASSWORD, input);
}