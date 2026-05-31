import type { FindingSeverity, SecurityFinding } from "@/types/scan";

const HEADER_WEIGHT = 35;

export const CHECK_DEFINITIONS: Array<{
  id: string;
  name: string;
  weight: number;
  category: SecurityFinding["category"];
  failureSeverity: FindingSeverity;
  recommendation: string;
}> = [
  {
    id: "https-enabled",
    name: "HTTPS Enabled",
    weight: 20,
    category: "transport",
    failureSeverity: "critical",
    recommendation: "Install a TLS certificate and serve the site only over HTTPS."
  },
  {
    id: "http-redirects-to-https",
    name: "HTTP Redirects to HTTPS",
    weight: 0,
    category: "transport",
    failureSeverity: "high",
    recommendation: "Add a permanent redirect from HTTP to HTTPS at your reverse proxy or web server."
  },
  {
    id: "hsts",
    name: "HSTS Header",
    weight: 15,
    category: "headers",
    failureSeverity: "high",
    recommendation: "Set Strict-Transport-Security with a long max-age value and includeSubDomains when possible."
  },
  {
    id: "csp",
    name: "Content-Security-Policy",
    weight: 15,
    category: "headers",
    failureSeverity: "high",
    recommendation: "Add a Content-Security-Policy header to restrict trusted script, style, and frame sources."
  },
  {
    id: "x-frame-options",
    name: "X-Frame-Options",
    weight: 9,
    category: "headers",
    failureSeverity: "medium",
    recommendation: "Use X-Frame-Options DENY or SAMEORIGIN to prevent clickjacking."
  },
  {
    id: "x-content-type-options",
    name: "X-Content-Type-Options",
    weight: 9,
    category: "headers",
    failureSeverity: "medium",
    recommendation: "Set X-Content-Type-Options to nosniff to reduce MIME sniffing attacks."
  },
  {
    id: "referrer-policy",
    name: "Referrer-Policy",
    weight: 8,
    category: "headers",
    failureSeverity: "low",
    recommendation: "Set Referrer-Policy to avoid leaking unnecessary URL context."
  },
  {
    id: "permissions-policy",
    name: "Permissions-Policy",
    weight: 9,
    category: "headers",
    failureSeverity: "low",
    recommendation: "Use Permissions-Policy to disable browser capabilities your site does not need."
  },
  {
    id: "server-header-hidden",
    name: "Server Header Exposure",
    weight: 0,
    category: "headers",
    failureSeverity: "info",
    recommendation: "Reduce server fingerprinting by removing or minimizing the Server response header."
  },
  {
    id: "secure-cookies",
    name: "Cookie Security Flags",
    weight: 15,
    category: "cookies",
    failureSeverity: "high",
    recommendation: "Mark cookies as Secure and HttpOnly, and ideally SameSite=Lax or Strict."
  },
  {
    id: "robots-txt",
    name: "Robots.txt Availability",
    weight: 0,
    category: "discovery",
    failureSeverity: "info",
    recommendation: "Publish a robots.txt file to reduce crawler ambiguity."
  },
  {
    id: "security-txt",
    name: "Security.txt Availability",
    weight: 0,
    category: "discovery",
    failureSeverity: "low",
    recommendation: "Publish /.well-known/security.txt so security researchers can report issues responsibly."
  }
];

export const HEADER_CHECK_WEIGHT_TOTAL = HEADER_WEIGHT;
