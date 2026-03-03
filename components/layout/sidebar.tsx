"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // if you want settings always at bottom like figma
  const settingsItem = adminNav.find((x) => x.href === "/settings");
  const mainItems = adminNav.filter((x) => x.href !== "/settings");

  return (
    <aside className="hidden md:flex w-[260px] h-screen sticky top-0 border-r bg-white flex-col">
      {/* Brand */}
      <div className="px-4 py-3 flex items-center gap-3">
        {/* If you have logo file: put it in /public/logo.png and uncomment Image */}
        {/* <Image src="/logo.png" alt="79er" width={36} height={36} className="rounded-lg" /> */}

        <div className="h-9 w-9 rounded-lg overflow-hidden bg-white border flex items-center justify-center">
          {/* fallback */}
          <span className="text-sm font-semibold text-orange-700">79</span>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold leading-4">Admin Portal</div>
          <div className="text-xs text-muted-foreground leading-4 truncate">
            79er Admin Panel
          </div>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="px-3 py-3 space-y-1">
        {mainItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-orange-50 text-orange-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50",
              )}
            >
              {/* left accent like figma */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full",
                  active ? "bg-orange-500" : "bg-transparent",
                )}
              />

              {Icon ? (
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-orange-700" : "text-gray-500",
                  )}
                />
              ) : (
                <span className="h-4 w-4" />
              )}

              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Separator />

        {/* Settings pinned bottom like figma */}
        <div className="px-3 py-3">
          {settingsItem ? (
            <Link
              href={settingsItem.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                isActive(settingsItem.href)
                  ? "bg-orange-50 text-orange-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50",
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full",
                  isActive(settingsItem.href) ? "bg-orange-500" : "bg-transparent",
                )}
              />

              {settingsItem.icon ? (
                <settingsItem.icon
                  className={cn(
                    "h-4 w-4",
                    isActive(settingsItem.href) ? "text-orange-700" : "text-gray-500",
                  )}
                />
              ) : (
                <span className="h-4 w-4" />
              )}

              <span className="truncate">{settingsItem.title}</span>
            </Link>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} 79er
        </div>
      </div>
    </aside>
  );
}
