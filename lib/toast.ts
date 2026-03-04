import { toast } from "sonner";
import type { ApiError } from "@/lib/http/error";
//lib/toast.ts
export function toastSuccess(message: string) {
  toast.success(message);
}

export function toastError(err: unknown, fallback = "Something went wrong") {
  const e = err as Partial<ApiError>;
  toast.error(e?.message || fallback);
}

export function toastInfo(message: string) {
  toast(message);
}