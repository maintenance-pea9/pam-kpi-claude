"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/app-provider";

export default function Home() {
  const router = useRouter();
  const { currentUser } = useApp();

  useEffect(() => {
    router.replace(currentUser ? "/dashboard" : "/login", {
      transitionTypes: [currentUser ? "nav-forward" : "nav-back"],
    });
  }, [currentUser, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC] text-sm text-slate-500">
      กำลังเข้าสู่ระบบ...
    </main>
  );
}
