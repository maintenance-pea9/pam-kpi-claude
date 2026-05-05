"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import { shortRoleLabels } from "@/lib/labels";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  BarChart3,
  CheckSquare,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  CheckSquare,
} as const;

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { currentUser, pendingTasks } = useApp();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[240px] bg-[#3B0764] p-0"
        style={{ viewTransitionName: "app-mobile-nav" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-5 pt-[18px] pb-[14px]">
          <div
            className="size-9 shrink-0 overflow-hidden rounded-full"
            style={{
              border: "2px solid rgba(201,168,76,0.4)",
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <Image src="/pea-logo.png" alt="PEA" width={36} height={36} className="size-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-100">PEA · PAM</div>
            <div className="text-[10px] text-purple-400">ระบบบริหารจัดการ KPI</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const badgeCount = item.showBadge ? pendingTasks : 0;

            return (
              <Link
                key={item.id}
                href={item.href}
                transitionTypes={["nav-forward"]}
                onClick={onClose}
                className={cn(
                  "mb-0.5 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors",
                  isActive
                    ? "bg-purple-500/25 font-semibold text-purple-100"
                    : "text-purple-400 hover:bg-white/5",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-purple-300" : "text-purple-600",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="rounded-full bg-amber-600 px-1.5 py-px text-[10px] font-bold text-white">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {currentUser && (
          <div className="border-t border-white/[0.08] p-2.5 pb-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2 py-1.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-700 to-[#C9A84C] text-xs font-bold text-white">
                {currentUser.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-purple-100">
                  {currentUser.name}
                </div>
                <div className="mt-0.5 text-[10px] text-purple-400">
                  {shortRoleLabels[currentUser.role]}
                  {currentUser.division && (
                    <span className="ml-1 font-mono text-[#C9A84C]">
                      · {currentUser.division}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
