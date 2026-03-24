import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, stack: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({
      error,
      stack: info?.componentStack || "",
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-3xl rounded-[32px] border border-red-200 bg-white/90 p-8 shadow-card">
            <p className="font-heading text-2xl text-slate-900">Something went wrong while rendering StudentHub.</p>
            {this.state.error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 font-mono text-sm text-red-700">{String(this.state.error.message || this.state.error)}</p> : null}
            {this.state.stack ? <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 px-4 py-4 text-xs text-slate-100">{this.state.stack}</pre> : null}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
