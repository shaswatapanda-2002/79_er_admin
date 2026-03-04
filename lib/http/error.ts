import axios from "axios";
//lib/http/error.ts
export type ApiError = {
  message: string;
  status: number;
  code?: string;
  details?: any;
};

export function normalizeApiError(err: unknown): ApiError {
  // Axios error
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 0;
    const data: any = err.response?.data;

    // Most backends return { message } or { error } or { errors }
    const message =
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors.join(", ") : "") ||
      err.message ||
      "Request failed";

    return {
      message,
      status,
      code: data?.code,
      details: data,
    };
  }

  // Generic error
  if (err instanceof Error) {
    return { message: err.message, status: 0 };
  }

  return { message: "Something went wrong", status: 0 };
}