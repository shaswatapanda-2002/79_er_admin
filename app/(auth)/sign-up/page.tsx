import { Suspense } from "react";
import SignUpPageClient from "./sign-up-page-client";

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpPageClient />
    </Suspense>
  );
}