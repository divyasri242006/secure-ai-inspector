import { NextResponse } from "next/server";
import { z } from "zod";

import { createSecurityReportPdf } from "@/services/report-service";
import type { SecurityScan } from "@/types/scan";

export const runtime = "nodejs";

const reportPayloadSchema = z.object({
  id: z.string(),
  url: z.string(),
  scannedAt: z.string(),
  score: z.number().int().min(0).max(100),
  grade: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  findings: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      passed: z.boolean(),
      severity: z.enum(["critical", "high", "medium", "low", "info"]),
      value: z.string(),
      weight: z.number(),
      category: z.enum(["transport", "headers", "cookies", "discovery"]),
      recommendation: z.string()
    })
  ),
  aiExplanations: z.array(
    z.object({
      finding: z.string(),
      whatItMeans: z.string(),
      whyItMatters: z.string(),
      riskLevel: z.enum(["critical", "high", "medium", "low", "info"]),
      howToFix: z.string()
    })
  ),
  summary: z.object({
    passed: z.number(),
    failed: z.number(),
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
    info: z.number()
  })
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reportPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid report payload" }, { status: 400 });
    }

    const scan = parsed.data as SecurityScan;
    const pdfBytes = await createSecurityReportPdf(scan);
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="secureai-report-${Date.now()}.pdf"`
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}