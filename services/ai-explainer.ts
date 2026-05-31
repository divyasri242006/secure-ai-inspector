import type { AIExplanation, FindingSeverity, SecurityFinding } from "@/types/scan";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-3-5-sonnet-latest";

function clampRiskLevel(value: string): FindingSeverity {
  const lower = value.toLowerCase();
  if (lower === "critical" || lower === "high" || lower === "medium" || lower === "low" || lower === "info") {
    return lower;
  }
  return "medium";
}

function fallbackExplanation(finding: SecurityFinding): AIExplanation {
  return {
    finding: finding.name,
    whatItMeans: `${finding.name} did not pass during the scan.`,
    whyItMatters: "Attackers often chain small configuration issues into larger security incidents.",
    riskLevel: finding.severity,
    howToFix: finding.recommendation
  };
}

function extractJsonArray(text: string) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON array found in AI response.");
  }

  const candidate = text.slice(start, end + 1);
  const parsed = JSON.parse(candidate);

  if (!Array.isArray(parsed)) {
    throw new Error("AI response is not a JSON array.");
  }

  return parsed;
}

export async function generateBeginnerExplanations(findings: SecurityFinding[], scannedUrl: string) {
  const failedFindings = findings.filter((finding) => !finding.passed);

  if (failedFindings.length === 0) {
    return [];
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return failedFindings.map(fallbackExplanation);
  }

  const prompt = `You are a cybersecurity mentor.

Explain the findings in beginner-friendly language.

For each issue provide:
1. What it means
2. Why it matters
3. Risk level
4. How to fix it

Use simple language.
Avoid jargon.

Return ONLY valid JSON array with fields:
- finding (string)
- whatItMeans (string)
- whyItMatters (string)
- riskLevel (critical|high|medium|low|info)
- howToFix (string)

Website: ${scannedUrl}
Issues:
${failedFindings.map((finding) => `- ${finding.name}: ${finding.value}`).join("\n")}`;

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 1800,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error (${response.status})`);
    }

    const payload = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const text = payload.content?.find((item) => item.type === "text")?.text;
    if (!text) {
      throw new Error("AI response text missing.");
    }

    const parsed = extractJsonArray(text);

    return parsed.map((item, index): AIExplanation => {
      const fallback = failedFindings[index] ? fallbackExplanation(failedFindings[index]) : null;

      return {
        finding: typeof item.finding === "string" ? item.finding : fallback?.finding ?? "Unknown finding",
        whatItMeans: typeof item.whatItMeans === "string" ? item.whatItMeans : fallback?.whatItMeans ?? "Explanation unavailable.",
        whyItMatters: typeof item.whyItMatters === "string" ? item.whyItMatters : fallback?.whyItMatters ?? "Impact unavailable.",
        riskLevel: clampRiskLevel(typeof item.riskLevel === "string" ? item.riskLevel : fallback?.riskLevel ?? "medium"),
        howToFix: typeof item.howToFix === "string" ? item.howToFix : fallback?.howToFix ?? "Review your server security configuration."
      };
    });
  } catch {
    return failedFindings.map(fallbackExplanation);
  }
}
