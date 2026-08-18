"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Uncaught UI Exception Caught by Error Boundary]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 my-6 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-slate-100">Something went wrong</h3>
            <p className="text-xs text-slate-400">
              An unexpected UI component error occurred. The application remains safe and database credentials are secure.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={this.handleReset}>
            <RefreshCw className="h-4 w-4" />
            Reload Component
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
