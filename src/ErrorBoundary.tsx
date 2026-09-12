import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Without this, an uncaught render error anywhere in the tree (e.g. a data
 * shape a real Supabase project returns that mock data never exercises)
 * unmounts the whole app, leaving only the dark body background — visually
 * indistinguishable from a blank page with no clue what broke.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("CyberGuard AI crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-5"
          style={{ background: "var(--bg, #10202C)", color: "var(--text, #E6F3F7)" }}
        >
          <div className="w-full max-w-lg rounded-xl border p-6" style={{ background: "var(--panel, #16303B)", borderColor: "var(--border, #2C4A56)" }}>
            <h1 className="text-sm font-bold mb-2">Something went wrong</h1>
            <p className="text-xs mb-4" style={{ color: "var(--muted, #8BB8C4)" }}>
              CyberGuard AI hit an unexpected error and couldn't render. This is the actual error, not a blank screen:
            </p>
            <pre className="text-xs p-3 rounded-lg overflow-x-auto mb-4" style={{ background: "#1a2f3c", color: "#F87171" }}>
              {this.state.error.message}
            </pre>
            <button
              className="text-xs px-4 py-2 rounded-lg font-semibold"
              style={{ background: "var(--accent, #9CDFF0)", color: "#10202C" }}
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
