import { randomUUID } from "node:crypto";

import { CHECK_DEFINITIONS } from "@/lib/security-checks";
import { calculateSecurityScore } from "@/lib/score";
import type { SecurityFinding, SecurityScan } from "@/types/scan";

const REQUEST_TIMEOUT_MS = 12000;
const USER_AGENT = "SecureAI-Inspector/1.0 (+passive security header scan)";

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(init.headers ?? {})
      }
    });
  } finally {
    clearTimeout(timeout);
  }
}

function buildFinding(
  id: string,
  passed: boolean,
  value: string,
  severityOverride?: SecurityFinding["severity"]
): SecurityFinding {
  const check = CHECK_DEFINITIONS.find((definition) => definition.id === id);
  if (!check) {
    throw new Error(`Unknown security check: ${id}`);
  }

  return {
    id: check.id,
    name: check.name,
    passed,
    severity: passed ? "info" : severityOverride ?? check.failureSeverity,
    value,
    weight: check.weight,
    category: check.category,
    recommendation: check.recommendation
  };
}

function getSetCookieValues(headers: Headers) {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const single = headers.get("set-cookie");
  return single ? [single] : [];
}

function evaluateCookieSecurity(cookieHeaders: string[]) {
  if (cookieHeaders.length === 0) {
    return buildFinding("secure-cookies", true, "No cookies were set during scan");
  }

  const insecureCookies = cookieHeaders.filter((cookie) => {
    const lower = cookie.toLowerCase();
    return !lower.includes("secure") || !lower.includes("httponly") || !lower.includes("samesite=");
  });

  if (insecureCookies.length === 0) {
    return buildFinding("secure-cookies", true, "All cookies include Secure, HttpOnly, and SameSite");
  }

  return buildFinding(
    "secure-cookies",
    false,
    `${insecureCookies.length} cookie(s) missing Secure/HttpOnly/SameSite`,
    "high"
  );
}

async function checkHttpRedirectToHttps(targetUrl: URL) {
  const httpCandidate = new URL(targetUrl.toString());
  httpCandidate.protocol = "http:";

  try {
    const response = await fetchWithTimeout(httpCandidate.toString(), {
      method: "GET",
      redirect: "manual"
    });

    const location = response.headers.get("location");
    if (!location) {
      return buildFinding("http-redirects-to-https", false, `No redirect returned (status ${response.status})`);
    }

    const redirectTarget = new URL(location, httpCandidate.toString());
    const passed = redirectTarget.protocol === "https:";

    return buildFinding(
      "http-redirects-to-https",
      passed,
      passed
        ? `Redirects to ${redirectTarget.origin}`
        : `Redirect points to ${redirectTarget.protocol}//`,
      "high"
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return buildFinding("http-redirects-to-https", false, `Unable to verify redirect: ${message}`, "medium");
  }
}

async function checkTextFileAvailability(origin: string, path: string, findingId: string) {
  try {
    const response = await fetchWithTimeout(`${origin}${path}`, {
      method: "GET",
      redirect: "follow"
    }, 8000);

    const exists = response.status >= 200 && response.status < 400;
    return buildFinding(findingId, exists, exists ? `Available (${response.status})` : `Missing (${response.status})`);
  } catch {
    return buildFinding(findingId, false, "Unavailable");
  }
}

export async function runPassiveScan(targetUrl: URL) {
  const findings: SecurityFinding[] = [];

  let baseResponse: Response;
  try {
    baseResponse = await fetchWithTimeout(targetUrl.toString(), {
      method: "GET",
      redirect: "follow"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed";
    throw new Error(`Could not fetch target website: ${message}`);
  }

  const headers = baseResponse.headers;
  const finalUrl = new URL(baseResponse.url || targetUrl.toString());

  findings.push(buildFinding("https-enabled", finalUrl.protocol === "https:", finalUrl.protocol === "https:" ? "HTTPS in use" : "Site resolved without HTTPS"));
  findings.push(await checkHttpRedirectToHttps(finalUrl));

  const hsts = headers.get("strict-transport-security");
  findings.push(buildFinding("hsts", Boolean(hsts), hsts ?? "Header missing"));

  const csp = headers.get("content-security-policy");
  findings.push(buildFinding("csp", Boolean(csp), csp ?? "Header missing"));

  const xFrameOptions = headers.get("x-frame-options");
  findings.push(buildFinding("x-frame-options", Boolean(xFrameOptions), xFrameOptions ?? "Header missing"));

  const xContentTypeOptions = headers.get("x-content-type-options");
  findings.push(
    buildFinding(
      "x-content-type-options",
      Boolean(xContentTypeOptions?.toLowerCase().includes("nosniff")),
      xContentTypeOptions ?? "Header missing"
    )
  );

  const referrerPolicy = headers.get("referrer-policy");
  findings.push(buildFinding("referrer-policy", Boolean(referrerPolicy), referrerPolicy ?? "Header missing"));

  const permissionsPolicy = headers.get("permissions-policy");
  findings.push(buildFinding("permissions-policy", Boolean(permissionsPolicy), permissionsPolicy ?? "Header missing"));

  const serverHeader = headers.get("server");
  findings.push(buildFinding("server-header-hidden", !serverHeader, serverHeader ? `Exposed: ${serverHeader}` : "Not exposed"));

  const cookieHeaderValues = getSetCookieValues(headers);
  findings.push(evaluateCookieSecurity(cookieHeaderValues));

  findings.push(await checkTextFileAvailability(finalUrl.origin, "/robots.txt", "robots-txt"));
  findings.push(await checkTextFileAvailability(finalUrl.origin, "/.well-known/security.txt", "security-txt"));

  const { score, grade } = calculateSecurityScore(findings);

  const summary = findings.reduce(
    (acc, finding) => {
      if (finding.passed) acc.passed += 1;
      if (!finding.passed) acc.failed += 1;
      acc[finding.severity] += 1;
      return acc;
    },
    {
      passed: 0,
      failed: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    }
  );

  const scan: Omit<SecurityScan, "aiExplanations"> = {
    id: randomUUID(),
    url: finalUrl.toString(),
    scannedAt: new Date().toISOString(),
    score,
    grade,
    findings,
    summary
  };

  return scan;
}
