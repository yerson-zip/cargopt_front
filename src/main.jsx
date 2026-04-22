import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CamionLoader from "./pages/CamionLoader";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CamionLoader />
  </StrictMode>
);