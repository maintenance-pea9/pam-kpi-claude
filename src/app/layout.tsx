import type { Metadata } from "next";
import { Sarabun, IBM_Plex_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/providers/app-provider";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบบริหารจัดการ KPI | ฝบร. PEA",
  description: "ระบบรายงานผลการดำเนินงานตามเกณฑ์วัดของสายงาน ฝ่ายบริหารจัดการสินทรัพย์ระบบไฟฟ้า",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AppProvider>
      </body>
    </html>
  );
}
