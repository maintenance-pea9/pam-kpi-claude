"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useApp } from "@/providers/app-provider";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useApp();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login", { transitionTypes: ["nav-back"] });
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC] text-sm text-slate-500">
        กำลังตรวจสอบสิทธิ์...
      </main>
    );
  }

  return <AppShell>{children}</AppShell>;
}
