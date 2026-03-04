"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const sp = useSearchParams();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // start
    bar.style.opacity = "1";
    bar.style.transform = "scaleX(0.15)";

    const t1 = window.setTimeout(() => {
      bar.style.transform = "scaleX(0.55)";
    }, 120);

    const t2 = window.setTimeout(() => {
      bar.style.transform = "scaleX(0.85)";
    }, 360);

    const done = window.setTimeout(() => {
      bar.style.transform = "scaleX(1)";
      window.setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "scaleX(0)";
      }, 180);
    }, 520);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(done);
    };
  }, [pathname, sp]);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[9998] h-1 w-full">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-black/70 opacity-0 transition-opacity duration-200"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}