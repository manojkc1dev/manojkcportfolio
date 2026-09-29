import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in application render tree:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-neutral-100 font-sans"
        >
          <div className="max-w-md w-full p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              An unexpected runtime error occurred. You can reload the page to restore the application state.
            </p>
            {this.state.error?.message && (
              <pre className="mb-6 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-red-400/90 text-left overflow-x-auto max-h-32 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
