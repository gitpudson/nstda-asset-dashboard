import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { AssetProvider }
  from "./contexts/AssetContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AssetProvider>
      <App />
    </AssetProvider>
  </React.StrictMode>
);