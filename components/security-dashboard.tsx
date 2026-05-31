"use client";

import { useMemo } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  ShieldAlert,
  ShieldCheck,
  ShieldMinus
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatTimestamp, riskFromScore } from "@/lib/utils";
import type { SecurityScan } from "@/types/scan";

interface SecurityDashboardProps {
  scan: SecurityScan;
  onDownload: (scan: SecurityScan) => Promise<void>;
  isDownloading: boolean;
}

function scoreTone(score: number) {
  if (score >= 85) return "text-emerald-300";
  if (score >= 70) return "text-cyan-300";
  if (score >= 50) return "text-amber-300";
  return "text-red-300";
}

function severityVariant(severity: string): "critical" | "high" | "medium" | "low" | "info" {
  if (severity === "critical" || severity === "high" || severity === "medium" || severity === "low" || severity === "info") {
    return severity;
  }
  return "info";
}

export function SecurityDashboard({ scan, onDownload, isDownloading }: SecurityDashboardProps) {
  const passFailData = useMemo(
    () => [
      { name: "Passed", value: scan.summary.passed },
      { name: "Failed", value: scan.summary.failed }
    ],
    [scan.summary.failed, scan.summary.passed]
  );

  const severityData = useMemo(
    () => [
      { name: "Critical", value: scan.summary.critical, fill: "#f87171" },
      { name: "High", value: scan.summary.high, fill: "#fb923c" },
      { name: "Medium", value: scan.summary.medium, fill: "#facc15" },
      { name: "Low", value: scan.summary.low, fill: "#86efac" },
      { name: "Info", value: scan.summary.info, fill: "#93c5fd" }
    ].filter((entry) => entry.value > 0),
    [scan.summary.critical, scan.summary.high, scan.summary.info, scan.summary.low, scan.summary.medium]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-slate-100">Security Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-borderSubtle bg-panelSoft/80 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Score</p>
              <p className={`mt-1 text-3xl font-bold ${scoreTone(scan.score)}`}>{scan.score}</p>
            </div>
            <div className="rounded-xl border border-borderSubtle bg-panelSoft/80 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Grade</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">{scan.grade}</p>
            </div>
            <div className="rounded-xl border border-borderSubtle bg-panelSoft/80 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Risk</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">{riskFromScore(scan.score)}</p>
            </div>
            <div className="rounded-xl border border-borderSubtle bg-panelSoft/80 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Scanned At</p>
              <p className="mt-1 text-sm text-slate-200">{formatTimestamp(scan.scannedAt)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">Target: {scan.url}</Badge>
            <Badge variant="low">Passed: {scan.summary.passed}</Badge>
            <Badge variant="high">Failed: {scan.summary.failed}</Badge>
          </div>

          <Button className="w-full sm:w-auto" disabled={isDownloading} onClick={() => onDownload(scan)}>
            <Download className="h-4 w-4" />
            {isDownloading ? "Generating PDF..." : "Download PDF Report"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pass vs Fail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={passFailData}>
                  <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip
                    contentStyle={{
                      background: "#0f1729",
                      border: "1px solid rgba(151,171,205,0.3)",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="value" fill="#2de0ff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Severity Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    data={severityData.length > 0 ? severityData : [{ name: "Info", value: 1, fill: "#93c5fd" }]}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={4}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0f1729",
                      border: "1px solid rgba(151,171,205,0.3)",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Findings Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Check</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scan.findings.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell className="font-medium text-slate-100">{finding.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 text-xs">
                      {finding.passed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          <span className="text-emerald-300">Passed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-300" />
                          <span className="text-red-300">Failed</span>
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={severityVariant(finding.severity)}>{finding.severity}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] text-slate-300">{finding.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Explanations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scan.aiExplanations.length === 0 ? (
            <p className="rounded-md border border-borderSubtle bg-panelSoft/70 px-4 py-3 text-sm text-slate-300">
              No failed checks to explain.
            </p>
          ) : (
            scan.aiExplanations.map((item) => (
              <article className="rounded-xl border border-borderSubtle bg-panelSoft/70 p-4" key={`${scan.id}-${item.finding}`}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-cyber-blue">{item.finding}</h4>
                  <Badge variant={severityVariant(item.riskLevel)}>{item.riskLevel}</Badge>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-slate-200">
                  <p>
                    <span className="font-semibold text-slate-100">What it means:</span> {item.whatItMeans}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">Why it matters:</span> {item.whyItMatters}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-100">How to fix:</span> {item.howToFix}
                  </p>
                </div>
              </article>
            ))
          )}

          <div className="flex flex-wrap gap-3 rounded-lg border border-borderSubtle bg-panelSoft/60 px-4 py-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-red-300" />
              Critical findings need urgent attention.
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldMinus className="h-3.5 w-3.5 text-amber-300" />
              Medium findings should be planned.
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Low/info findings are optimization opportunities.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
