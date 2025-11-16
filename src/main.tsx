import "./polyfills";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error("React initialization error:", error);
  // Fallback: show error message
  document.getElementById("root")!.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Application Error</h1>
      <p>Please try refreshing the page or disabling browser extensions.</p>
      <button onclick="window.location.reload()">Reload Page</button>
    </div>
  `;
}
