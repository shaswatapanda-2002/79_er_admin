import { cookies } from "next/headers";
import { redirect } from "next/navigation";
//app/page.tsx
export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  redirect("/sign-up");
}