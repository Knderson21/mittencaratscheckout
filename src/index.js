/* eslint-disable max-len */
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Local imports
import "./index.css";
import App from "./App";
import { AppProvider } from "./utils/appContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}>
      <HashRouter basename="/">
        <AppProvider>
          <App />
        </AppProvider>
      </HashRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
