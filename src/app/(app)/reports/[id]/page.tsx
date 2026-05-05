"use client";

import { useParams } from "next/navigation";
import { ReportDetail } from "@/components/reports/report-detail";

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  return <ReportDetail id={params.id} />;
}
