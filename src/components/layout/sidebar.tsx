"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import { shortRoleLabels } from "@/lib/labels";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  CheckSquare,
} as const;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { currentUser, pendingTasks } = useApp();
  const w = collapsed ? 68 : 240;

  return (
    <aside
      className="sticky top-0 hidden h-dvh shrink-0 flex-col overflow-hidden bg-[#3B0764] md:flex"
      style={{
        width: w,
        transition: "width 250ms ease",
        viewTransitionName: "app-sidebar",
      }}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-[60px] shrink-0 items-center gap-2.5 border-b border-white/[0.08]",
          collapsed ? "justify-center px-4" : "px-5",
        )}
      >
        <div
          className="size-9 shrink-0 overflow-hidden rounded-full"
          style={{
            border: "2px solid rgba(201,168,76,0.4)",
            boxShadow: "0 0 0 3px rgba(109,40,217,0.2)",
            background: "rgba(255,255,255,0.15)",
          }}
        >
          <Image src="/pea-logo.png" alt="PEA" width={36} height={36} className="size-full object-contain" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-[13px] font-bold leading-tight text-purple-100 whitespace-nowrap">
              PEA · PAM
            </div>
            <div className="mt-0.5 text-[10px] text-purple-300 whitespace-nowrap">
              ระบบบริหารจัดการ KPI
            </div>
          </div>
        )}
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-5 pt-3.5 pb-1.5">
          <span className="text-[9px] font-bold tracking-[0.12em] text-purple-600 uppercase">
            เมนูหลัก
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className={cn("min-h-0 flex-1 overflow-y-auto", collapsed ? "px-2.5 py-2" : "px-2.5 py-1")}>
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
              title={collapsed ? item.label : undefined}
              className={cn(
                "relative mb-0.5 flex items-center rounded-lg transition-colors duration-150",
                collapsed ? "justify-center py-2.5" : "gap-2.5 px-3 py-2.5",
                isActive
                  ? "bg-purple-500/25 font-semibold text-purple-100"
                  : "text-purple-300 hover:bg-white/5",
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  isActive ? "text-purple-200" : "text-purple-500",
                )}
              />
              {!collapsed && (
                <span className="flex-1 text-[13px] whitespace-nowrap">{item.label}</span>
              )}
              {badgeCount > 0 && !collapsed && (
                <span className="shrink-0 rounded-full bg-amber-600 px-1.5 py-px text-[10px] font-bold text-white">
                  {badgeCount}
                </span>
              )}
              {badgeCount > 0 && collapsed && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="mx-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border-none bg-white/[0.04] py-1.5 text-[10px] text-purple-600 transition-colors hover:bg-white/[0.08]"
      >
        {collapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <>
            <ChevronLeft className="size-3.5" />
            <span className="whitespace-nowrap">ย่อเมนู</span>
          </>
        )}
      </button>

      {/* User info */}
      <div
        className={cn(
          "mt-2 border-t border-white/[0.08]",
          collapsed ? "py-3" : "px-3 pt-3 pb-4",
        )}
      >
        {currentUser ? (
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "gap-2.5 rounded-lg bg-white/[0.04] px-2.5 py-2",
            )}
          >
            <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6D28D9] to-[#C9A84C] text-[13px] font-bold text-white">
              {currentUser.initial}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-purple-100">
                  {currentUser.name}
                </div>
                <div className="mt-0.5 text-[10px] text-purple-300">
                  {shortRoleLabels[currentUser.role]}
                  {currentUser.division && (
                    <span className="ml-1 font-mono text-[#C9A84C]">
                      · {currentUser.division}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
