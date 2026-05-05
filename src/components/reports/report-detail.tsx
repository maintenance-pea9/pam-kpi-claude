"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApprovalActions } from "@/components/shared/approval-actions";
import { ApprovalSteps } from "@/components/shared/approval-steps";
import { ApprovalTimeline } from "@/components/shared/approval-timeline";
import { DivBadge } from "@/components/shared/div-badge";
import { Field } from "@/components/shared/field";
import { LevelBadge } from "@/components/shared/level-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { computeLevel, formatThaiMonthYear } from "@/lib/workflow";
import { useApp } from "@/providers/app-provider";
import { ArrowLeft, CheckCircle2, Circle, Save } from "lucide-react";

const LEVELS = [1, 2, 3, 4, 5] as const;

type ReportFormState = {
  actualText: string;
  performanceSummary: string;
  level4Action: string;
  obstacles: string;
  correctivePlan: string;
};

export function ReportDetail({ id }: { id: string }) {
  const router = useRouter();
  const {
    currentUser,
    kpis,
    reports,
    canEdit,
    canSubmit,
    canApprove,
    canRevise,
    updateReport,
    submitRecord,
    approveRecord,
    reviseRecord,
  } = useApp();

  const report = reports.find((item) => item.id === id);
  const kpi = report ? kpis.find((item) => item.id === report.kpiId) : undefined;
  const [form, setForm] = useState<ReportFormState>(() => ({
    actualText: report?.actual?.toString() ?? "",
    performanceSummary: report?.performanceSummary ?? "",
    level4Action: report?.level4Action ?? "",
    obstacles: report?.obstacles ?? "",
    correctivePlan: report?.correctivePlan ?? "",
  }));

  if (!report || !kpi) {
    return (
      <EmptyState
        onBack={() =>
          router.push("/reports", { transitionTypes: ["nav-back"] })
        }
      />
    );
  }

  const parsedActual = form.actualText.trim() === "" ? null : Number(form.actualText);
  const actual = parsedActual === null || Number.isFinite(parsedActual) ? parsedActual : null;
  const level = computeLevel(actual, kpi.targets, kpi.unit);
  const editable = currentUser ? canEdit(currentUser, report) : false;

  const save = () => {
    updateReport(report.id, {
      actual,
      scoreLevel: level,
      performanceSummary: form.performanceSummary,
      level4Action: form.level4Action,
      obstacles: form.obstacles,
      correctivePlan: form.correctivePlan,
    });
  };

  const passTarget = (target: number) => {
    if (actual === null || Number.isNaN(actual)) return false;
    return kpi.unit === "ครั้ง" ? actual <= target : actual >= target;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 rounded-lg border border-purple-100 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push("/reports", { transitionTypes: ["nav-back"] })
            }
            aria-label="กลับ"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-950">{kpi.code}</h1>
              <StatusBadge status={report.status} />
              <DivBadge div={report.division} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatThaiMonthYear(report.month, report.year)} · {kpi.criterion}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {editable && (
            <Button onClick={save} className="gap-1.5">
              <Save className="size-4" />
              บันทึกรายงาน
            </Button>
          )}
          {currentUser && (
            <ApprovalActions
              showSubmit={canSubmit(currentUser, report)}
              showApprove={canApprove(currentUser, report)}
              showRevise={canRevise(currentUser, report)}
              onSubmit={(note) => submitRecord("report", report.id, note)}
              onApprove={(note) => approveRecord("report", report.id, note)}
              onRevise={(reason) => reviseRecord("report", report.id, reason)}
            />
          )}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <Card className="rounded-lg border-purple-100 shadow-sm">
            <CardHeader>
              <CardTitle>ข้อมูล KPI</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-xs">
              <div>
                <div className="font-semibold text-slate-900">{kpi.criterion}</div>
                <p className="mt-0.5 leading-5 text-slate-500">{kpi.definition}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-4">
                <Info label="น้ำหนัก" value={`${kpi.weight}%`} />
                <Info label="หน่วย" value={kpi.unit} />
                <Info label="หมวดหมู่" value={kpi.category} />
                <Info label="ผู้รับผิดชอบ" value={kpi.primaryOwner} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-purple-100 shadow-sm">
            <CardHeader>
              <CardTitle>ผลการดำเนินงาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                <Field label={`Actual value (${kpi.unit})`}>
                  <Input
                    value={form.actualText}
                    disabled={!editable}
                    inputMode="decimal"
                    onChange={(event) => setForm((current) => ({ ...current, actualText: event.target.value }))}
                    className="h-10 font-mono text-xl font-semibold"
                  />
                </Field>
                <div className="rounded-lg border border-purple-100 bg-purple-50/40 p-3">
                  <div className="text-[11px] text-slate-500">ระดับที่คำนวณได้</div>
                  <div className="mt-1.5"><LevelBadge level={level} /></div>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-5">
                {LEVELS.map((targetLevel) => {
                  const passed = passTarget(kpi.targets[targetLevel]);
                  return (
                    <div key={targetLevel} className="rounded-lg border border-purple-100 bg-white p-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-600">ระดับ {targetLevel}</span>
                        {passed ? (
                          <CheckCircle2 className="size-4 text-green-600" />
                        ) : (
                          <Circle className="size-4 text-slate-300" />
                        )}
                      </div>
                      <div className={cn("mt-1.5 font-mono text-base font-semibold", passed ? "text-green-700" : "text-slate-500")}>
                        {kpi.targets[targetLevel]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-purple-100 shadow-sm">
            <CardHeader>
              <CardTitle>รายละเอียดประกอบผล</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Field label="ผลการดำเนินงาน">
                <Textarea rows={3} value={form.performanceSummary} disabled={!editable} onChange={(event) => setForm((current) => ({ ...current, performanceSummary: event.target.value }))} />
              </Field>
              <Field label="แนวทางระดับ 4">
                <Textarea rows={2} value={form.level4Action} disabled={!editable} onChange={(event) => setForm((current) => ({ ...current, level4Action: event.target.value }))} />
              </Field>
              <Field label="ปัญหาอุปสรรค">
                <Textarea rows={2} value={form.obstacles} disabled={!editable} onChange={(event) => setForm((current) => ({ ...current, obstacles: event.target.value }))} />
              </Field>
              <Field label="แนวทางแก้ไข">
                <Textarea rows={2} value={form.correctivePlan} disabled={!editable} onChange={(event) => setForm((current) => ({ ...current, correctivePlan: event.target.value }))} />
              </Field>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-lg border-purple-100 shadow-sm">
          <CardHeader>
            <CardTitle>เส้นทางอนุมัติ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto pb-1"><ApprovalSteps status={report.status} /></div>
            <ApprovalTimeline logs={report.approvalLogs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2.5 py-1.5">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="mt-0.5 truncate font-medium text-slate-800">{value}</div>
    </div>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="rounded-lg border border-purple-100 bg-white p-8 text-center shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">ไม่พบรายงาน</h1>
      <p className="mt-2 text-sm text-slate-500">รายงานนี้อาจยังไม่ได้สร้างหรืออยู่นอกสิทธิ์การมองเห็น</p>
      <Button onClick={onBack} className="mt-4">กลับไปหน้ารายงาน</Button>
    </div>
  );
}
