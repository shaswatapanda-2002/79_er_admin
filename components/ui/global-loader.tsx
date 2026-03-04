"use client";

import { useEffect } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useUiStore } from "@/lib/stores/ui.store";

function Spinner() {
  return (
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-2 border-white/25" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
    </div>
  );
}

export default function GlobalLoader() {
  const manualLoading = useUiStore((s) => s.globalLoading);
  const text = useUiStore((s) => s.globalLoadingText);

  const fetching = useIsFetching();
  const mutating = useIsMutating();

  const show = manualLoading || fetching > 0 || mutating > 0;

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (!show) return null;

  const label =
    text ||
    (mutating > 0 ? "Saving changes..." : fetching > 0 ? "Loading..." : "Please wait...");

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 px-6 py-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <Spinner />
            <div className="min-w-0">
              <p className="text-base font-semibold text-white">Please wait</p>
              <p className="mt-0.5 text-sm text-white/80 truncate">{label}</p>
            </div>
          </div>

          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-1/2 animate-[loader_1.1s_ease-in-out_infinite] rounded-full bg-white/70" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loader {
          0% {
            transform: translateX(-60%);
          }
          50% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(-60%);
          }
        }
      `}</style>
    </div>
  );
}