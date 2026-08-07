import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CJMPage from "../app/page";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element is missing");
}

createRoot(root).render(
  <StrictMode>
    <CJMPage />
  </StrictMode>,
);
