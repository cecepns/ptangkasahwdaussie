import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { ASSETS } from "@/assets";
import App from "./App";
import "./index.css";
import "aos/dist/aos.css";

const favicon = document.querySelector('link[rel="icon"]');
if (favicon) favicon.href = ASSETS.logo;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "Plus Jakarta Sans, sans-serif",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#003399", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#D31111", secondary: "#fff" },
        },
      }}
    />
  </StrictMode>
);
