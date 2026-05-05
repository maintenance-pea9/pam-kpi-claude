"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApprovalActions } from "@/components/shared/approval-actions";
import { ApprovalSteps } from "@/components/shared/approval-steps";
import { ApprovalTimeline } from "@/components/shared/approval-timeline";
import { DivBadge } from "@/components/shared/div-badge";
import { Field } from "@/components/shared/field";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KPI_CATEGORIES, KPI_UNITS } from "@/lib/constants";
import type { DivisionCode, KpiItem, KpiTargets } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DIVISIONS } from "@/lib/workflow";
import { useApp } from "@/providers/app-provider";
import { AlertTriangle, ArrowLeft, Save } from "lucide-react";

const LEVELS = [1, 2, 3, 4, 5] as const;

type KpiFormState = {
  division: DivisionCode;
  criterion: string;
  definition: string;
  unit: string;
  weight: number;
  category: string;
  targets: KpiTargets;
  primaryOwner: string;
  coOwnersText: string;
  initiative: string;
};

function toForm(kpi: KpiItem): KpiFormState {
  return {
    division: kpi.division,
    criterion: kpi.criterion,
    definition: kpi.definition,
    unit: kpi.unit,
    weight: kpi.weight,
    category: kpi.category,
    targets: kpi.targets,
    primaryOwner: kpi.primaryOwner,
    coOwnersText: kpi.coOwners.join(", "),
    initiative: kpi.initiative,
  };
}

function createDefault(currentDivision: DivisionCode | null | undefined, ownerName: string | undefined): KpiFormState {
  return {
    division: currentDivision ?? "กบร.",
    criterion: "",
    definition: "",
    unit: "%",
    weight: 10,
    category: KPI_CATEGORIES[0],
    targets: { 1: 60, 2: 70, 3: 80, 4: 90, 5: 95 },
    primaryOwner: ownerName ?? "",
    coOwnersText: "",
    initiative: "",
  };
}

export function KpiForm({ id }: { id: string }) {
  const router = useRouter();
  const {
    currentUser,
    kpis,
    canEdit,
    canSubmit,
    canApprove,
    canRevise,
    createKpi,
    updateKpi,
    submitRecord,
    approveRecord,
    reviseRecord,
  } = useApp();

  const isNew = id === "new";
  const existing = isNew ? undefined : kpis.find((kpi) => kpi.id === id);
  const [form, setForm] = useState<KpiFormState>(() =>
    existing ? toForm(existing) : createDefault(currentUser?.division, currentUser?.name),
  );

  if (!isNew && !existing) {
    return (
      <EmptyState
        onBack={() => router.push("/kpi", { transitionTypes: ["nav-back"] })}
      />
    );
  }

  const editable = currentUser
    ? isNew
      ? currentUser.role === "assignee" && currentUser.division === form.division
      : Boolean(existing && canEdit(currentUser, existing))
    : false;
  const lastRevision = existing?.approvalLogs.findLast((log) => log.action === "revise");

  const setField = <K extends keyof KpiFormState>(key: K, value: KpiFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    const payload = {
      division: form.division,
      criterion: form.criterion,
      definition: form.definition,
      unit: form.unit,
      weight: Number(form.weight) || 0,
      category: form.category,
      targets: form.targets,
      primaryOwner: form.primaryOwner,
      coOwners: form.coOwnersText.split(",").map((item) => item.trim()).filter(Boolean),
      initiative: form.initiative,
    };

    if (isNew) {
      const newId = createKpi(payload);
      router.replace(`/kpi/${newId}`, { transitionTypes: ["nav-forward"] });
    } else if (existing) {
      updateKpi(existing.id, payload);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 rounded-lg border border-purple-100 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push("/kpi", { transitionTypes: ["nav-back"] })
            }
            aria-label="กลับ"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-950">
                {isNew ? "สร้าง KPI ใหม่" : existing?.code}
              </h1>
              {existing && <StatusBadge status={existing.status} />}
              <DivBadge div={form.division} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {editable ? "แก้ไขข้อมูลได้ตามสิทธิ์ของผู้จัดทำ" : "โหมดอ่านอย่างเดียวสำหรับบทบาทปัจจุบัน"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {editable && (
            <Button onClick={save} className="gap-1.5">
              <Save className="size-4" />
              บันทึกฉบับร่าง
            </Button>
          )}
          {existing && currentUser && (
            <ApprovalActions
              showSubmit={canSubmit(currentUser, existing)}
              showApprove={canApprove(currentUser, existing)}
              showRevise={canRevise(currentUser, existing)}
              onSubmit={(note) => submitRecord("kpi", existing.id, note)}
              onApprove={(note) => approveRecord("kpi", existing.id, note)}
              onRevise={(reason) => reviseRecord("kpi", existing.id, reason)}
            />
          )}
        </div>
      </div>

      {existing?.status === "revision_requested" && lastRevision?.reason && (
        <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div>
            <div className="font-semibold">ถูกส่งกลับแก้ไข</div>
            <div className="mt-1 leading-6">{lastRevision.reason}</div>
          </div>
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="rounded-lg border-purple-100 shadow-sm">
          <CardHeader>
            <CardTitle>รายละเอียดตัวชี้วัด</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Field label="ชื่อตัวชี้วัด" required>
              <Input value={form.criterion} disabled={!editable} onChange={(event) => setField("criterion", event.target.value)} />
            </Field>
            <Field label="คำนิยาม" required>
              <Textarea value={form.definition} disabled={!editable} rows={3} onChange={(event) => setField("definition", event.target.value)} />
            </Field>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="กอง" required>
                <select
                  value={form.division}
                  disabled={!isNew || !editable}
                  onChange={(event) => setField("division", event.target.value as DivisionCode)}
                  className="h-7 rounded-md border border-input bg-white px-2 text-xs disabled:opacity-60"
                >
                  {DIVISIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="หมวดหมู่" required>
                <select
                  value={form.category}
                  disabled={!editable}
                  onChange={(event) => setField("category", event.target.value)}
                  className="h-7 rounded-md border border-input bg-white px-2 text-xs disabled:opacity-60"
                >
                  {KPI_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="หน่วย" required>
                <select
                  value={form.unit}
                  disabled={!editable}
                  onChange={(event) => setField("unit", event.target.value)}
                  className="h-7 rounded-md border border-input bg-white px-2 text-xs disabled:opacity-60"
                >
                  {KPI_UNITS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="น้ำหนัก (%)" required>
                <Input type="number" value={form.weight} disabled={!editable} onChange={(event) => setField("weight", Number(event.target.value))} />
              </Field>
              <Field label="ผู้รับผิดชอบหลัก" required>
                <Input value={form.primaryOwner} disabled={!editable} onChange={(event) => setField("primaryOwner", event.target.value)} />
              </Field>
              <Field label="ผู้รับผิดชอบร่วม">
                <Input value={form.coOwnersText} disabled={!editable} onChange={(event) => setField("coOwnersText", event.target.value)} placeholder="คั่นด้วย comma" />
              </Field>
            </div>
            <Field label="แผนงาน / Initiative">
              <Textarea value={form.initiative} disabled={!editable} rows={2} onChange={(event) => setField("initiative", event.target.value)} />
            </Field>
            <div>
              <div className="mb-1.5 text-xs font-semibold text-slate-700">เป้าหมายระดับคะแนน</div>
              <div className="grid gap-2 md:grid-cols-5">
                {LEVELS.map((level) => (
                  <label key={level} className="rounded-lg border border-purple-100 bg-purple-50/40 p-2">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <span className={cn("size-2 rounded-full", level >= 4 ? "bg-green-500" : level === 3 ? "bg-amber-500" : "bg-red-500")} />
                      ระดับ {level}
                    </span>
                    <Input
                      type="number"
                      value={form.targets[level]}
                      disabled={!editable}
                      onChange={(event) =>
                        setField("targets", { ...form.targets, [level]: Number(event.target.value) })
                      }
                      className="mt-1.5 bg-white font-mono"
                    />
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-purple-100 shadow-sm">
          <CardHeader>
            <CardTitle>เส้นทางอนุมัติ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto pb-1">
              <ApprovalSteps status={existing?.status ?? "draft"} />
            </div>
            {existing ? (
              <ApprovalTimeline logs={existing.approvalLogs} />
            ) : (
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                บันทึก KPI ก่อนเพื่อเริ่มเส้นทางอนุมัติ
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="rounded-lg border border-purple-100 bg-white p-8 text-center shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">ไม่พบข้อมูล KPI</h1>
      <p className="mt-2 text-sm text-slate-500">รายการนี้อาจถูกลบหรืออยู่นอกสิทธิ์การมองเห็น</p>
      <Button onClick={onBack} className="mt-4">กลับไปหน้ารายการ</Button>
    </div>
  );
}
