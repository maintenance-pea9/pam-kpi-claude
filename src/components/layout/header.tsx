"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import { shortRoleLabels } from "@/lib/labels";
import { PAGE_TITLES } from "@/lib/constants";
import { MONTHS_SHORT } from "@/lib/workflow";
import { Calendar, ChevronDown, LogOut, Menu } from "lucide-react";

function getPageKey(pathname: string): string {
  if (pathname.startsWith("/kpi/")) return "kpi-detail";
  if (pathname.startsWith("/reports/")) return "report-detail";
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg || "dashboard";
}

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, selectedMonth, selectedYear, logout } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const pageKey = getPageKey(pathname);
  const meta = PAGE_TITLES[pageKey] ?? PAGE_TITLES.dashboard;

  const handleLogout = () => {
    logout();
    router.push("/login", { transitionTypes: ["nav-back"] });
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center justify-between border-b border-purple-100 bg-white px-3 md:px-7"
      style={{ viewTransitionName: "app-header" }}
    >
      {/* Left: mobile menu + breadcrumbs */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden">
            <Menu className="size-5 text-slate-600" />
          </button>
        )}
        <div>
          <div className="mb-0.5 flex items-center gap-1.5 text-[11px]">
            <span className="font-mono text-slate-400">PAM</span>
            {meta.crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-slate-300">/</span>
                <span
                  className={
                    i === meta.crumbs.length - 1
                      ? "font-medium text-purple-500"
                      : "text-slate-400"
                  }
                >
                  {c}
                </span>
              </span>
            ))}
          </div>
          <div className="text-[15px] font-semibold text-slate-800">{meta.title}</div>
        </div>
      </div>

      {/* Right: month chip + user */}
      <div className="flex items-center gap-2.5">
        {/* Month chip */}
        <div className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-purple-100 bg-purple-50 px-3 py-[5px] sm:flex">
          <Calendar className="size-3.5 text-purple-500" />
          <span className="font-mono text-[12px] font-medium text-purple-700">
            {MONTHS_SHORT[selectedMonth - 1]} {selectedYear}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        {/* User dropdown */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex items-center gap-2 rounded-[10px] border border-purple-100 bg-[#FAFAFA] px-2.5 py-[5px] pl-1.5 transition-colors hover:bg-purple-50"
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#6D28D9] to-[#C9A84C] text-[12px] font-bold text-white">
                {currentUser.initial}
              </div>
              <div className="hidden text-left sm:block">
                <div className="max-w-[130px] truncate text-[12px] font-semibold text-slate-700">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {shortRoleLabels[currentUser.role]}
                  {currentUser.division ? ` · ${currentUser.division}` : ""}
                </div>
              </div>
              <ChevronDown className="size-3 text-slate-400" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute top-[calc(100%+6px)] right-0 z-50 w-[200px] rounded-xl border border-purple-100 bg-white p-1.5 shadow-lg">
                  <div className="border-b border-slate-100 px-3 py-2 pb-2.5">
                    <div className="text-xs font-semibold text-slate-800">
                      {currentUser.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {currentUser.title}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="size-3.5" />
                    ออกจากระบบ
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
