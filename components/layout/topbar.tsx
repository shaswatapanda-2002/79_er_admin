"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Search } from "lucide-react";

import { useAdminProfileQuery } from "@/src/queries/settings.queries";

export default function Topbar() {
  const router = useRouter();

  const { data, isLoading } = useAdminProfileQuery();
  const profile = data?.data;

  function getInitials(name?: string) {
    if (!name) return "A";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
    

      {/* Right */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl px-2 h-10">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatarUrl || ""} />
                <AvatarFallback className="bg-orange-100 text-orange-700">
                  {getInitials(profile?.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="ml-2 text-left hidden sm:block">
                <div className="text-xs font-semibold leading-4">
                  {isLoading ? "Loading..." : profile?.fullName}
                </div>

                <div className="text-[11px] text-muted-foreground leading-4">
                  {profile?.email}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52 rounded-2xl">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 focus:text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}