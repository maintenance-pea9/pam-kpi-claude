"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_ROLES } from "@/lib/constants";
import { useApp } from "@/providers/app-provider";
import { AlertCircle, Eye, Loader2, Lock, UserRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useApp();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.replace("/dashboard", { transitionTypes: ["nav-forward"] });
    }
  }, [currentUser, router]);

  const tryLogin = (id: string, pwd: string) => {
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      if (pwd !== "pea2568") {
        setError("รหัสผ่านไม่ถูกต้อง");
        setLoading(false);
        return;
      }
      const ok = login(id);
      setLoading(false);
      if (ok) {
        router.replace("/dashboard", { transitionTypes: ["nav-forward"] });
      } else {
        setError("ไม่พบรหัสพนักงานในระบบ");
      }
    }, 500);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId.trim() || !password.trim()) return;
    tryLogin(userId.trim(), password);
  };

  const disabled = loading || !userId || !password;

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden font-sans"
      style={{
        background:
          "linear-gradient(135deg, #1a0533 0%, #2d0a5e 35%, #3B0764 60%, #4a1580 100%)",
      }}
    >
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            top: -150,
            left: -100,
            background:
              "radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: -100,
            right: -50,
            background:
              "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            top: "40%",
            right: "10%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          }}
        />
        {/* Grid pattern */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
          style={{ opacity: 0.04 }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth={1} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center px-6">
        {/* Logo + Title */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div
            className="overflow-hidden rounded-full"
            style={{
              width: 80,
              height: 80,
              border: "3px solid rgba(201,168,76,0.6)",
              boxShadow:
                "0 0 0 6px rgba(109,40,217,0.2), 0 8px 32px rgba(0,0,0,0.3)",
              background: "rgba(255,255,255,0.15)",
            }}
          >
            <Image
              src="/pea-logo.png"
              alt="PEA"
              width={80}
              height={80}
              className="size-full object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <div className="text-[22px] font-bold leading-snug text-purple-100">
              ระบบบริหารจัดการ KPI
            </div>
            <div className="mt-1 text-[13px] text-purple-300">
              ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า (ฝบร.)
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-purple-300/60">
              PAM · KPI Reporting System
            </div>
          </div>
        </div>

        {/* Glass card */}
        <div
          className="w-full"
          style={{
            borderRadius: 20,
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            padding: "32px 32px 28px",
          }}
        >
          <div className="mb-1.5 text-base font-semibold text-purple-100">
            เข้าสู่ระบบ
          </div>
          <div className="mb-6 text-xs text-purple-300/80">
            กรุณากรอกรหัสพนักงานและรหัสผ่าน
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Employee ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide text-purple-200/90">
                รหัสพนักงาน
              </label>
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2 text-purple-300 opacity-50"
                />
                <input
                  type="text"
                  value={userId}
                  onChange={(event) => {
                    setUserId(event.target.value);
                    setError("");
                  }}
                  placeholder="กรอกรหัสพนักงาน..."
                  className="w-full rounded-[10px] py-[11px] pr-3 pl-[38px] text-[13px] text-purple-100 outline-none transition-colors placeholder:text-purple-300/40"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)"}`,
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide text-purple-200/90">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2 text-purple-300 opacity-50"
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="รหัสผ่าน"
                  className="w-full rounded-[10px] py-[11px] pr-10 pl-[38px] text-[13px] text-purple-100 outline-none transition-colors placeholder:text-purple-300/40"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)"}`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-0.5 opacity-50"
                  aria-label="toggle password visibility"
                >
                  <Eye className="size-[15px] text-purple-300" />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                <AlertCircle className="size-[13px] text-red-400" />
                <span className="text-xs text-red-300">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={disabled}
              className="mt-1 cursor-pointer rounded-[10px] py-3 text-sm font-semibold text-white transition-all"
              style={{
                background: disabled
                  ? "rgba(109,40,217,0.4)"
                  : "linear-gradient(135deg,#6D28D9,#8B5CF6)",
                boxShadow: disabled
                  ? "none"
                  : "0 4px 14px rgba(109,40,217,0.4)",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-[14px] animate-spin" />
                  กำลังตรวจสอบ...
                </span>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
        </div>

        {/* Demo quick login */}
        <div className="mt-5 w-full">
          <div className="mb-2.5 text-center text-[11px] tracking-[0.06em] text-purple-300/50 uppercase">
            Demo — เข้าสู่ระบบด้วย Role
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {DEMO_ROLES.map((role) => (
              <button
                key={role.key}
                type="button"
                onClick={() => {
                  setUserId(role.key);
                  setPassword("pea2568");
                  setError("");
                }}
                className="cursor-pointer rounded-full px-3 py-[5px] text-[11px] font-medium transition-all"
                style={{
                  background:
                    userId === role.key
                      ? "rgba(109,40,217,0.5)"
                      : "rgba(255,255,255,0.07)",
                  color:
                    userId === role.key
                      ? "#EDE9FE"
                      : "rgba(196,181,253,0.7)",
                  border: `1px solid ${
                    userId === role.key
                      ? "rgba(139,92,246,0.5)"
                      : "rgba(255,255,255,0.1)"
                  }`,
                }}
              >
                {role.label}
              </button>
            ))}
          </div>
          <div className="mt-2 text-center text-[11px] text-purple-300/40">
            รหัสผ่าน:{" "}
            <span className="font-mono text-purple-200/50">pea2568</span>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-purple-300/30">
          การไฟฟ้าส่วนภูมิภาค · Provincial Electricity Authority
        </div>
      </div>
    </main>
  );
}
