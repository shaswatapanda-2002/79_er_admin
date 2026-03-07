"use client";

import { Suspense, useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

import { makeQueryClient } from "@/lib/query/query-client";
import { useAuthStore } from "@/lib/auth/auth.store";

import GlobalLoader from "@/components/ui/global-loader";
import TopProgress from "@/components/ui/top-progress";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => makeQueryClient());

  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <TopProgress />
      </Suspense>{" "}
      <GlobalLoader />
      <Toaster richColors position="top-right" />
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
