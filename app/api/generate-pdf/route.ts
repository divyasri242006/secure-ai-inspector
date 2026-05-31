import { NextResponse } from "next/server";

import { createSecurityReportPdf } from "@/services/report-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const pdfBytes = await createSecurityReportPdf(payload);
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="secureai-report-${Date.now()}.pdf"`
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}