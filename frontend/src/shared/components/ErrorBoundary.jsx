import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          background: '#F9FAFB',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: '32px',
            maxWidth: 480,
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 48,
              marginBottom: 16,
            }}>
              ⚠️
            </div>
            <h2 style={{
              margin: '0 0 12px 0',
              fontSize: 20,
              fontWeight: 600,
              color: '#111827',
            }}>
              Something went wrong
            </h2>
            <p style={{
              margin: '0 0 24px 0',
              fontSize: 14,
              color: '#6B7280',
              lineHeight: 1.6,
            }}>
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 24px',
                background: '#004D40',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.target.style.background = '#003D33'}
              onMouseOut={(e) => e.target.style.background = '#004D40'}
            >
              Try Again
            </button>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details style={{
                marginTop: 24,
                textAlign: 'left',
                fontSize: 12,
                color: '#9CA3AF',
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: 8 }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  background: '#F3F4F6',
                  padding: 12,
                  borderRadius: 6,
                  overflow: 'auto',
                  maxHeight: 200,
                }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
