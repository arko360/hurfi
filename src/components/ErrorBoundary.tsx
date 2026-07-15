import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
  /** Optional label for logs */
  name?: string;
};

type State = {
  hasError: boolean;
  message: string;
};

/**
 * Catches render errors so one page failure never blanks the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "Unknown render error";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    const label = this.props.name ?? "App";
    console.error(`[ErrorBoundary:${label}]`, error, info.componentStack);
  }

  private reset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        className="container"
        style={{
          padding: "96px 0 80px",
          textAlign: "center",
          minHeight: "50vh",
        }}
      >
        <p
          style={{
            margin: "0 auto 12px",
            display: "inline-flex",
            padding: "8px 14px",
            borderRadius: 999,
            background: "var(--blue-soft)",
            color: "var(--blue)",
            fontWeight: 750,
            fontSize: "0.82rem",
          }}
        >
          Something went wrong
        </p>
        <h1 style={{ margin: "0 auto", color: "var(--navy)", letterSpacing: "-0.03em" }}>
          This page hit an unexpected error
        </h1>
        <p style={{ margin: "14px auto 0", maxWidth: "46ch", color: "var(--muted)", lineHeight: 1.6 }}>
          The rest of the site is fine. You can go back home or try again.
        </p>
        {import.meta.env.DEV && this.state.message ? (
          <pre
            style={{
              margin: "20px auto 0",
              maxWidth: 560,
              padding: 14,
              textAlign: "left",
              background: "#f4f7fc",
              borderRadius: 12,
              border: "1px solid var(--line)",
              color: "#334",
              fontSize: "0.78rem",
              overflow: "auto",
            }}
          >
            {this.state.message}
          </pre>
        ) : null}
        <div
          style={{
            marginTop: 28,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="btn btn-ghost" onClick={this.reset}>
            Try again
          </button>
          <Link className="btn btn-primary" to="/" onClick={this.reset}>
            Back to Home
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </main>
    );
  }
}
