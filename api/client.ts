import type { ScanErrorResponse, ScanRequestPayload, SecurityScan } from "@/types/scan";

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as ScanErrorResponse;
    return payload.error || "Request failed";
  } catch {
    return "Request failed";
  }
}

export async function requestSecurityScan(payload: ScanRequestPayload) {
  const response = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as SecurityScan;
}

export async function requestPdfReport(scan: SecurityScan) {
  const response = await fetch("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scan)
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.blob();
}
