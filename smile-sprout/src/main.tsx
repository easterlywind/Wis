import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Controlled auto-reload helper (exposed on window)
// - Uses sessionStorage key `app_reload_attempts`
// - Capped retries to avoid reload loops
// - Exponential backoff between attempts
function attemptAutoReload(source?: string) {
	try {
		const key = "app_reload_attempts";
		const maxAttempts = 3;
		const raw = sessionStorage.getItem(key) || "0";
		let attempts = Number(raw) || 0;
		if (attempts >= maxAttempts) {
			// eslint-disable-next-line no-console
			console.warn("Max auto-reload attempts reached; not reloading.", { source, attempts });
			return;
		}

		attempts += 1;
		sessionStorage.setItem(key, String(attempts));

		// exponential backoff: 1s, 2s, 4s
		const delay = 1000 * Math.pow(2, attempts - 1);
		// eslint-disable-next-line no-console
		console.warn(`Auto reload scheduled (attempt ${attempts}/${maxAttempts}) in ${delay}ms`, { source });

		setTimeout(() => {
			// eslint-disable-next-line no-console
			console.warn(`Reloading page (attempt ${attempts})`, { source });
			try {
				window.location.reload();
			} catch (e) {
				// fallback
				// eslint-disable-next-line no-console
				console.error("Reload failed", e);
			}
		}, delay);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error("attemptAutoReload error:", e);
	}
}

// Expose helper globally so ErrorBoundary and global handlers can call it
(window as any).attemptAutoReload = attemptAutoReload;

// Global error handlers - will log and schedule auto-reload
window.addEventListener("error", (e) => {
	// eslint-disable-next-line no-console
	console.error("Global error:", e.error || e.message, e);
	try {
		(window as any).attemptAutoReload("global-error");
	} catch {
		/* ignore */
	}
});
window.addEventListener("unhandledrejection", (e) => {
	// eslint-disable-next-line no-console
	console.error("Unhandled promise rejection:", e.reason);
	try {
		(window as any).attemptAutoReload("unhandledrejection");
	} catch {
		/* ignore */
	}
});

createRoot(document.getElementById("root")!).render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>
);
