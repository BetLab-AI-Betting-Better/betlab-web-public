"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DesktopHeader, MobileBottomNav, MobileHeader } from "@/presentation/components/layouts";
import type { CurrentUser } from "@/core/entities/user.entity";

type NavTab = "home" | "virtual" | "matches" | "favorites" | "settings";

interface PublicShellProps {
  children: ReactNode;
  user: CurrentUser | null;
}

export function PublicShell({ children, user }: PublicShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = (): NavTab => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/virtual-match")) return "virtual";
    if (pathname.startsWith("/matches")) return "matches";
    if (pathname.startsWith("/favorites")) return "favorites";
    if (pathname.startsWith("/settings")) return "settings";
    return "home";
  };

  const handleTabChange = (tab: NavTab) => {
    switch (tab) {
      case "home":
        router.push("/");
        break;
      case "virtual":
        router.push("/virtual-match");
        break;
      case "matches":
        router.push("/matches");
        break;
      case "favorites":
        router.push("/favorites");
        break;
      case "settings":
        router.push("/settings");
        break;
    }
  };

  const userInfo = user
    ? {
        name: user.email || "User",
        email: user.email || "",
        avatar: undefined,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader
        className="lg:hidden"
        avatarFallback={user?.email?.[0].toUpperCase() || "U"}
      />

      <DesktopHeader
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
        user={userInfo}
        onProfileClick={() => router.push("/settings")}
        onSettingsClick={() => router.push("/settings")}
      />

      <main className="max-w-7xl mx-auto">
        <div className="pb-[calc(56px+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </div>
      </main>

      <MobileBottomNav
        className="lg:hidden"
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
