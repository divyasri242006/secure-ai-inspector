import dns from "node:dns/promises";
import type { LookupAddress } from "node:dns";
import { isIP } from "node:net";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1"
]);

const BLOCKED_SUFFIXES = [".local", ".internal", ".home", ".corp"];

function isPrivateIPv4(ip: string) {
  const [a, b] = ip.split(".").map((part) => Number(part));

  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 0) return true;

  return false;
}

function isPrivateIPv6(ip: string) {
  const lower = ip.toLowerCase();

  if (lower.startsWith("::ffff:")) {
    const mapped = lower.replace("::ffff:", "");
    return isPrivateIPv4(mapped);
  }

  return (
    lower === "::1" ||
    lower.startsWith("fc") ||
    lower.startsWith("fd") ||
    lower.startsWith("fe80")
  );
}

export function isPrivateOrBlockedAddress(address: string) {
  const ipVersion = isIP(address);
  if (ipVersion === 4) return isPrivateIPv4(address);
  if (ipVersion === 6) return isPrivateIPv6(address);

  return false;
}

function isBlockedHostname(hostname: string) {
  const normalized = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(normalized)) return true;

  return BLOCKED_SUFFIXES.some((suffix) => normalized.endsWith(suffix));
}

export function normalizeInputUrl(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error("Please provide a URL to scan.");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error("Invalid URL format. Please include a valid domain.");
  }

  if (!parsed.hostname) {
    throw new Error("A domain name is required.");
  }

  if (!(parsed.protocol === "http:" || parsed.protocol === "https:")) {
    throw new Error("Only http:// and https:// URLs are allowed.");
  }

  if (parsed.username || parsed.password) {
    throw new Error("URLs with embedded credentials are not allowed.");
  }

  return parsed;
}

export async function assertPublicTarget(url: URL) {
  const hostname = url.hostname.toLowerCase();

  if (isBlockedHostname(hostname)) {
    throw new Error("Local or internal hostnames are blocked for safety.");
  }

  const ipVersion = isIP(hostname);
  if (ipVersion > 0 && isPrivateOrBlockedAddress(hostname)) {
    throw new Error("Private and loopback IP addresses are not allowed.");
  }

  if (ipVersion > 0) {
    return;
  }

  let resolved: LookupAddress[];
  try {
    resolved = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new Error("Domain could not be resolved. Please verify the URL.");
  }

  if (resolved.length === 0) {
    throw new Error("Domain resolved to no addresses.");
  }

  const blockedAddress = resolved.find((entry) => isPrivateOrBlockedAddress(entry.address));
  if (blockedAddress) {
    throw new Error("Resolved address is private/internal and cannot be scanned.");
  }
}

export async function validateAndNormalizePublicUrl(rawInput: string) {
  const parsed = normalizeInputUrl(rawInput);
  await assertPublicTarget(parsed);
  return parsed;
}