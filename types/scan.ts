export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface SecurityFinding {
  id: string;
  name: string;
  passed: boolean;
  severity: FindingSeverity;
  value: string;
  weight: number;
  category: "transport" | "headers" | "cookies" | "discovery";
  recommendation: string;
}

export interface AIExplanation {
  finding: string;
  whatItMeans: string;
  whyItMatters: string;
  riskLevel: FindingSeverity;
  howToFix: string;
}

export type SecurityGrade = "Excellent" | "Good" | "Fair" | "Poor";

export interface SecurityScan {
  id: string;
  url: string;
  scannedAt: string;
  score: number;
  grade: SecurityGrade;
  findings: SecurityFinding[];
  aiExplanations: AIExplanation[];
  summary: {
    passed: number;
    failed: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface ScanRequestPayload {
  url: string;
}

export interface ScanErrorResponse {
  error: string;
  details?: string;
}
