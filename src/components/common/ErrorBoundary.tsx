import React, { Component, ErrorInfo, ReactNode } from 'react';
import { analytics } from '../../utils/analytics';
import { AlertCircle, RefreshCw, Home, Phone } from 'lucide-react';

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
    analytics.captureException(error, errorInfo.componentStack || undefined);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 select-none">
          <div className="max-w-md w-full bg-[#FAF8F5] border border-[#141414]/8 rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 bg-[#FAF9F6] border border-[#141414]/8 rounded-full flex items-center justify-center mx-auto text-[#A7654A]">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
                Atelier Exception Handler
              </span>
              <h2 className="font-serif text-2xl text-[#141414]">
                Something Interrupted Your View
              </h2>
            </div>

            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              We encountered an unexpected display anomaly. Our automated systems have logged this issue and our team has been notified.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={this.handleReload}
                className="flex-1 h-12 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 h-12 bg-[#FAF8F5] hover:bg-[#EAE5DF] text-[#141414] border border-[#141414]/15 text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Atelier Home</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#141414]/8 flex items-center justify-center gap-2 text-[11px] text-[#73706B]">
              <Phone className="w-3.5 h-3.5 text-[#A7654A]" />
              <span>Direct Concierge: +91 7977641125</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
