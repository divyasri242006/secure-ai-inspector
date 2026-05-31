import { NextResponse } from "next/server";
import { z } from "zod";

import { validateAndNormalizePublicUrl } from "@/lib/ssrf";
import { generateBeginnerExplanations } from "@/services/ai-explainer";
import { runPassiveScan } from "@/services/scanner-service";

export const runtime = "nodejs";

const requestSchema = z.object({
  url: z.string().trim().min(1, "URL is required").max(2048)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid request"
        },
        { status: 400 }
      );
    }

    const normalizedUrl = await validateAndNormalizePublicUrl(parsed.data.url);
    const partialScan = await runPassiveScan(normalizedUrl);
    const aiExplanations = await generateBeginnerExplanations(partialScan.findings, partialScan.url);

    return NextResponse.json({
      ...partialScan,
      aiExplanations
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected scan failure";
    const statusCode =
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("blocked") ||
      message.toLowerCase().includes("required") ||
      message.toLowerCase().includes("not allowed")
        ? 400
        : 500;

    return NextResponse.json(
      {
        error: message,
        details: statusCode === 500 ? "Please retry the scan in a few moments." : undefined
      },
      { status: statusCode }
    );
  }
}
