"use client";

import { useParams } from "next/navigation";
import { KpiForm } from "@/components/kpi/kpi-form";

export default function KpiDetailPage() {
  const params = useParams<{ id: string }>();
  return <KpiForm id={params.id} />;
}
