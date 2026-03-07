import { Suspense } from "react";
import SignInPageClient from "./sign-in-page-client";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInPageClient />
    </Suspense>
  );
}