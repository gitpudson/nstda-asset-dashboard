import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { AssetProvider }
  from "./contexts/AssetContext";

const redirect =
  sessionStorage.redirect;

if (redirect) {

  delete sessionStorage.redirect;

  window.history.replaceState(
    null,
    null,
    redirect
  );

}

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <AssetProvider>
    <App />
  </AssetProvider>
);