import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="summerkhan0.us.auth0.com"
      clientId="1edEK69sli0NltPf67zzzABmUu7QIWPe"
      authorizationParams={{
        redirect_uri: "https://royal-properties-client-side.vercel.app",
      }}
      audience="http://localhost:8000"
      scope="openid profile email"
    >
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </Auth0Provider>
  </React.StrictMode>
);
