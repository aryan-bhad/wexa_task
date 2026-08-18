"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface DatabaseErrorBannerProps {
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function DatabaseErrorBanner({
  message = "CognoDB Cloud is currently unreachable. Check database credentials or network connectivity.",
  onRetry,
  isRetrying = false,
}: DatabaseErrorBannerProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-950 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 shrink-0 border border-rose-200">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-800 tracking-tight">Database Connection Issue</h4>
            <p className="text-xs text-rose-700 mt-0.5">{message}</p>
          </div>
        </div>

        {onRetry && (
          <Button variant="danger" size="sm" onClick={onRetry} disabled={isRetrying}>
            <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Retrying..." : "Retry Connection"}
          </Button>
        )}
      </div>
    </div>
  );
}
