import React from "react";

type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error
    // eslint-disable-next-line no-console
    console.error("Uncaught error in component tree:", error, info);

    // Try a controlled auto-reload if available (capped retries)
    try {
      const maybe = (window as any).attemptAutoReload;
      if (typeof maybe === "function") maybe("ErrorBoundary");
    } catch (e) {
      // ignore
    }
  }

  componentDidMount() {
    // If app mounts successfully, clear reload attempts so future errors can retry again
    try {
      sessionStorage.removeItem("app_reload_attempts");
    } catch (e) {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) {
      // read attempt count for UI
      let attempts = 0;
      try {
        attempts = Number(sessionStorage.getItem("app_reload_attempts") || "0");
      } catch (e) {
        attempts = 0;
      }

      const maxAttempts = 3;

      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-semibold mb-2">Đã xảy ra lỗi</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Ứng dụng gặp sự cố khi chuyển trang. Hệ thống sẽ tự thử tải lại ({attempts}/{maxAttempts}).
            </p>
            <pre className="text-xs text-left overflow-auto bg-gray-100 p-3 rounded mb-4">
              {String(this.state.error)}
            </pre>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-primary text-white rounded"
                onClick={() => window.location.reload()}
              >
                Tải lại ngay
              </button>
              <button
                className="px-4 py-2 border rounded"
                onClick={() => {
                  try {
                    const maybe = (window as any).attemptAutoReload;
                    if (typeof maybe === "function") maybe("ManualTrigger");
                  } catch (e) {
                    window.location.reload();
                  }
                }}
              >
                Thử tự động
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
