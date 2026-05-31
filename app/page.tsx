"use client";

import { useState } from "react";
import { Activity, Cpu, FileDown, Lock, Radar } from "lucide-react";

import { requestPdfReport, requestSecurityScan } from "@/api/client";
import { RecentScans } from "@/components/recent-scans";
import { ScanForm } from "@/components/scan-form";
import { SecurityDashboard } from "@/components/security-dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScanHistory } from "@/hooks/use-scan-history";
import type { SecurityScan } from "@/types/scan";

const PASSIVE_CHECK_LIST = [
  "HTTPS enabled",
  "HTTP to HTTPS redirect",
  "HSTS and security headers",
  "Cookie security flags",
  "robots.txt and security.txt"
];

export default function HomePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentScan, setCurrentScan] = useState<SecurityScan | null>(null);

  const { history, addScan, clearHistory } = useScanHistory();

  const handleScan = async (url: string) => {
    setIsScanning(true);
    setError(null);

    try {
      const scan = await requestSecurityScan({ url });
      setCurrentScan(scan);
      addScan(scan);
    } catch (scanError) {
      const message = scanError instanceof Error ? scanError.message : "Scan failed";
      setError(message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDownload = async (scan: SecurityScan) => {
    setIsDownloading(true);
    try {
      const pdfBlob = await requestPdfReport(scan);
      const objectUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `secureai-inspector-report-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (downloadError) {
      const message = downloadError instanceof Error ? downloadError.message : "Report download failed";
      setError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-borderSubtle bg-panel/80 p-8 shadow-glow backdrop-blur-glass">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyber-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-[-40px] h-48 w-48 rounded-full bg-cyber-green/10 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <Badge className="text-[10px] uppercase tracking-[0.22em]" variant="default">
                Passive Security Analyzer
              </Badge>
              <h1 className="text-3xl font-bold leading-tight text-slate-100 sm:text-4xl">
                SecureAI Inspector
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Scan any public website with non-intrusive checks, get a weighted security score, and receive beginner-friendly
                AI guidance for fixes.
              </p>

              <div className="grid gap-2 sm:grid-cols-2 lg:max-w-xl">
                {PASSIVE_CHECK_LIST.map((item) => (
                  <div className="metric-chip" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 self-start">
              <Card className="bg-panelSoft/90">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Cpu className="h-4 w-4 text-cyber-blue" />
                    AI Translation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-300">
                  Claude explains each issue in plain English with risk level and remediation guidance.
                </CardContent>
              </Card>

              <Card className="bg-panelSoft/90">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileDown className="h-4 w-4 text-cyber-green" />
                    Instant PDF Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-300">
                  Download a report containing score, findings, and AI recommendations for team handoff.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <ScanForm error={error} isLoading={isScanning} onScan={handleScan} />
            {currentScan ? (
              <SecurityDashboard isDownloading={isDownloading} onDownload={handleDownload} scan={currentScan} />
            ) : (
              <Card>
                <CardContent className="flex items-center gap-3 p-6 text-sm text-slate-300">
                  <Radar className="h-5 w-5 text-cyber-blue" />
                  Run a scan to view scorecards, findings, visual severity charts, and AI explanations.
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <RecentScans
              onClear={() => {
                clearHistory();
                if (history.length > 0 && currentScan && history[0]?.id === currentScan.id) {
                  setCurrentScan(null);
                }
              }}
              onOpen={(scan) => {
                setError(null);
                setCurrentScan(scan);
              }}
              scans={history}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-cyber-green" />
                  Safety Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <p>Only passive checks are used. No brute force, exploitation, or penetration testing actions are performed.</p>
                <p>Private and local network addresses are blocked to prevent SSRF and unsafe scanning behavior.</p>
                <p className="inline-flex items-center gap-2 text-xs text-slate-400">
                  <Activity className="h-4 w-4 text-cyber-blue" />
                  Scanner checks response headers and publicly reachable metadata only.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
