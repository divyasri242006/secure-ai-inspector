"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { SecurityScan } from "@/types/scan";

const STORAGE_KEY = "secure-ai-inspector:scan-history";
const MAX_HISTORY = 10;

export function useScanHistory() {
  const [history, setHistory] = useState<SecurityScan[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SecurityScan[];
      if (Array.isArray(parsed)) {
        setHistory(parsed);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const persist = useCallback((next: SecurityScan[]) => {
    setHistory(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addScan = useCallback(
    (scan: SecurityScan) => {
      setHistory((previous) => {
        const filtered = previous.filter((existing) => existing.id !== scan.id);
        const next = [scan, ...filtered].slice(0, MAX_HISTORY);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    persist([]);
  }, [persist]);

  return useMemo(
    () => ({
      history,
      addScan,
      clearHistory
    }),
    [addScan, clearHistory, history]
  );
}
