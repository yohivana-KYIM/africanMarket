import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

if (root.children.length > 0) {
  // Page was prerendered — hydrate to preserve existing HTML
  hydrateRoot(root, app);
} else {
  // No prerendered content (dev mode or non-prerendered route)
  createRoot(root).render(app);
}
