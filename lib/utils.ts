import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { SecurityGrade } from "@/types/scan";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(isoTimestamp: string) {
  const date = new Date(isoTimestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function scoreToGrade(score: number): SecurityGrade {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}

export function riskFromScore(score: number) {
  if (score >= 85) return "Low";
  if (score >= 70) return "Moderate";
  if (score >= 50) return "Elevated";
  return "High";
}
