"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DivBadge } from "@/components/shared/div-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ApprovalStatus, DivisionCode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DIVISIONS } from "@/lib/workflow";
import { useApp } from "@/providers/app-provider";
import { Edit, Eye, Plus, Search } from "lucide-react";

const STATUS_FILTERS: Array<{ value: "all" | ApprovalStatus; label: string }> = [
  { value: "all", label: "ทั้งหมด" },
  { value: "draft", label: "ฉบับร่าง" },
  { value: "pending_l1", label: "รอ ผอ.กอง" },
  { value: "pending_l2", label: "รอผู้รวบรวมฯ" },
  { value: "pending_l3", label: "รอ ผอ.ฝ่าย" },
  { value: "approved", label: "อนุมัติแล้ว" },
  { value: "revision_requested", label: "ส่งกลับ" },
];

const TH = [
  "รหัส KPI",
  "ชื่อตัวชี้วัด",
  "กอง",
  "หมวดหมู่",
  "น้ำหนัก",
  "สถานะ",
  "ดำเนินการ",
];

export function KpiList() {
  const router = useRouter();
  const { currentUser, visibleKpis, canEdit } = useApp();
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState<"all" | DivisionCode>("all");
  const [status, setStatus] = useState<"all" | ApprovalStatus>("all");

  const isAssignee = currentUser?.role === "assignee";

  const divFilters: Array<{ key: "all" | DivisionCode; label: string }> = [
    { key: "all", label: "ทุกกอง" },
    ...DIVISIONS.map((d) => ({ key: d, label: d })),
  ];

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return visibleKpis.filter((kpi) => {
      if (division !== "all" && kpi.division !== division) return false;
      if (status !== "all" && kpi.status !== status) return false;
      if (
        text &&
        !kpi.criterion.toLowerCase().includes(text) &&
        !kpi.code.toLowerCase().includes(text)
      ) {
        return false;
      }
      return true;
    });
  }, [division, query, status, visibleKpis]);

  return (
    <div className="space-y-5">
      {/* Top bar: search + division pills + create */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-[320px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400 opacity-60" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหา KPI..."
            className="bg-white pl-8"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {divFilters.map((f) => (
            <Pill
              key={f.key}
              active={division === f.key}
              onClick={() => setDivision(f.key)}
              mono
            >
              {f.label}
            </Pill>
          ))}
        </div>

        {isAssignee && (
          <Link
            href="/kpi/new"
            transitionTypes={["nav-forward"]}
            className={cn(buttonVariants(), "gap-1.5 bg-purple-600 hover:bg-purple-700")}
          >
            <Plus className="size-4" />
            สร้าง KPI ใหม่
          </Link>
        )}
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_FILTERS.map((item) => (
          <Pill
            key={item.value}
            active={status === item.value}
            onClick={() => setStatus(item.value)}
          >
            {item.label}
          </Pill>
        ))}
        <span className="ml-2 text-[12px] leading-[30px] text-slate-400">
          {filtered.length} รายการ
        </span>
      </div>

      {/* Table card */}
      <div
        className="overflow-hidden rounded-xl border border-purple-100 bg-white"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(107,33,168,0.05)" }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {TH.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    "border-b border-slate-100 bg-[#FAFAFA] px-4 py-2.5 text-[11px] font-semibold tracking-wider whitespace-nowrap text-slate-500 uppercase",
                    i === TH.length - 1 ? "text-center" : "text-left",
                    i === 1 && "w-[32%]",
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={TH.length}
                  className="px-10 py-10 text-center text-[13px] text-slate-400"
                >
                  ไม่พบรายการที่ตรงกับเงื่อนไข
                </td>
              </tr>
            )}
            {filtered.map((kpi, i) => {
              const editable = currentUser ? canEdit(currentUser, kpi) : false;
              return (
                <tr
                  key={kpi.id}
                  onClick={() =>
                    router.push(`/kpi/${kpi.id}`, {
                      transitionTypes: ["nav-forward"],
                    })
                  }
                  className="cursor-pointer transition-colors hover:!bg-[#F5F3FF]"
                  style={{ background: i % 2 === 0 ? "#fff" : "#FAF9FF" }}
                >
                  <td className="px-4 py-3 font-mono text-[12px] whitespace-nowrap text-purple-500">
                    {kpi.code}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] leading-snug font-medium text-slate-800">
                      {kpi.criterion}
                    </div>
                    <div className="mt-0.5 max-w-[340px] overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-slate-400">
                      {kpi.definition}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <DivBadge div={kpi.division} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-600">
                      {kpi.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px] text-slate-600">
                    {kpi.weight}%
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={kpi.status} size="sm" />
                  </td>
                  <td
                    className="px-4 py-3 text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Link
                      href={`/kpi/${kpi.id}`}
                      transitionTypes={["nav-forward"]}
                      className="mx-auto flex w-fit items-center gap-1 rounded-md bg-purple-50 px-2.5 py-[5px] text-[11px] font-medium text-purple-500"
                    >
                      {editable ? (
                        <Edit className="size-3" />
                      ) : (
                        <Eye className="size-3" />
                      )}
                      {editable ? "แก้ไข" : "ดู"}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  mono = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-[5px] text-[12px] font-medium transition-colors",
        mono && "font-mono font-semibold",
        active
          ? "border-purple-600 bg-purple-600 text-white"
          : "border-slate-200 bg-white text-slate-500 hover:bg-purple-50",
      )}
    >
      {children}
    </button>
  );
}
