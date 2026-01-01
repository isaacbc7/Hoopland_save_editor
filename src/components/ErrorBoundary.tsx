import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-hoopland-dark flex items-center justify-center p-8">
          <div className="card text-center max-w-md">
            <h2 className="text-lg font-pixel text-hoopland-text mb-4">ERROR OCCURRED</h2>
            <p className="text-xs font-pixel-alt text-hoopland-dark mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="btn-primary"
            >
              RELOAD PAGE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

