"use client";

import { FormEvent, useMemo, useState } from "react";
import { AlertTriangle, Globe2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ScanFormProps {
  onScan: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const EXAMPLES = ["https://example.com", "https://github.com", "https://vercel.com"];

function isLikelyHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ScanForm({ onScan, isLoading, error }: ScanFormProps) {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError ?? error;

  const statusLine = useMemo(() => {
    if (isLoading) return "Running passive checks...";
    if (activeError) return "Scan blocked or failed. Please review the message below.";
    return "No intrusive tests are performed. This scanner is read-only.";
  }, [activeError, isLoading]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!isLikelyHttpUrl(url)) {
      setLocalError("Please enter a valid http:// or https:// URL.");
      return;
    }

    await onScan(url.trim());
  };

  return (
    <Card className="animate-pulseGlow">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
          <ShieldCheck className="h-5 w-5 text-cyber-blue" />
          Start Security Scan
        </CardTitle>
        <p className="text-sm text-slate-300">{statusLine}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://your-domain.com"
            autoComplete="off"
            disabled={isLoading}
          />

          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? "Scanning..." : "Run Passive Audit"}
          </Button>
        </form>

        {activeError ? (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <span>{activeError}</span>
            </div>
          </div>
        ) : null}

        <div className="space-y-2 border-t border-borderSubtle pt-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Try Example Targets</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {EXAMPLES.map((exampleUrl) => (
              <button
                key={exampleUrl}
                className="flex items-center gap-2 rounded-md border border-borderSubtle bg-panelSoft px-3 py-2 text-left text-xs text-slate-300 transition hover:border-cyber-blue/60 hover:text-cyber-blue"
                disabled={isLoading}
                onClick={() => setUrl(exampleUrl)}
                type="button"
              >
                <Globe2 className="h-3.5 w-3.5" />
                <span className="truncate">{exampleUrl}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
