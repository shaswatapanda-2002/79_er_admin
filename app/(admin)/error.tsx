"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin segment error:", error);
  }, [error]);

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-lg rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="mt-2 text-sm opacity-80">
          Please try again. If the problem continues, contact support.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => reset()}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Retry
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Go Home
          </button>
        </div>

        <pre className="mt-5 max-h-48 overflow-auto rounded-xl bg-black/5 p-3 text-xs">
          {error.message}
        </pre>
      </div>
    </div>
  );
}