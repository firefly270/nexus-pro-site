import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', _error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303] text-zinc-100 p-8">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-6">⚠</div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-zinc-500 text-sm mb-6">
              {this.state.error?.message ?? 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
