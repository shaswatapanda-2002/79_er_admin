"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Bell, Search } from "lucide-react";

const notifications = [
  {
    dot: "bg-blue-500",
    title: "New user registration: John Smith",
    time: "2 hours ago",
  },
  {
    dot: "bg-yellow-500",
    title: "Agency verification pending",
    time: "5 hours ago",
  },
  {
    dot: "bg-green-500",
    title: "Payment received: ₹24,999",
    time: "1 day ago",
  },
  {
    dot: "bg-red-500",
    title: "New support ticket #1234",
    time: "2 days ago",
  },
];

export default function Topbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 w-full max-w-[520px]">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 rounded-xl" />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative rounded-xl h-10 w-10 p-0"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {/* indicator */}
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[340px] rounded-2xl p-0 overflow-hidden"
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Notifications</div>
              <Badge variant="secondary" className="rounded-full text-xs">
                {notifications.length}
              </Badge>
            </div>

            <DropdownMenuSeparator />

            <div className="p-2 space-y-1">
              {notifications.map((n, i) => (
                <button
                  key={i}
                  className="w-full text-left flex gap-3 rounded-xl px-3 py-2 hover:bg-muted/30"
                  onClick={() => router.push("/notifications")}
                  type="button"
                >
                  <span className={`mt-2 h-2 w-2 rounded-full ${n.dot}`} />
                  <div className="min-w-0">
                    <div className="text-sm leading-5 truncate">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.time}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-2 border-t bg-white">
              <Button
                variant="outline"
                className="w-full rounded-xl text-xs"
                onClick={() => router.push("/notifications")}
              >
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile dropdown (Super Admin style) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl px-2 h-10">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-orange-100 text-orange-700">
                  SA
                </AvatarFallback>
              </Avatar>

              <div className="ml-2 text-left hidden sm:block">
                <div className="text-xs font-semibold leading-4">Super Admin</div>
                <div className="text-[11px] text-muted-foreground leading-4">
                  superadmin@79er.com
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52 rounded-2xl">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
