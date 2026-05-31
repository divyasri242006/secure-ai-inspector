"use client";

import { ExternalLink, History, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";
import type { SecurityScan } from "@/types/scan";

interface RecentScansProps {
  scans: SecurityScan[];
  onOpen: (scan: SecurityScan) => void;
  onClear: () => void;
}

export function RecentScans({ scans, onOpen, onClear }: RecentScansProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-slate-100">
          <History className="h-4 w-4 text-cyber-blue" />
          Recent Scans
        </CardTitle>

        <Button disabled={scans.length === 0} onClick={onClear} size="sm" variant="ghost">
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </CardHeader>

      <CardContent>
        {scans.length === 0 ? (
          <p className="py-3 text-sm text-slate-400">No scans yet. Run your first audit above.</p>
        ) : (
          <ul className="space-y-2">
            {scans.map((scan) => (
              <li
                className="flex items-center justify-between rounded-lg border border-borderSubtle bg-panelSoft/70 px-3 py-2"
                key={scan.id}
              >
                <button className="min-w-0 text-left" onClick={() => onOpen(scan)} type="button">
                  <p className="truncate text-sm font-medium text-slate-100">{scan.url}</p>
                  <p className="text-xs text-slate-400">{formatTimestamp(scan.scannedAt)}</p>
                </button>

                <div className="ml-2 flex items-center gap-2">
                  <span className="metric-chip">{scan.score}/100</span>
                  <Button onClick={() => onOpen(scan)} size="icon" variant="secondary">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
