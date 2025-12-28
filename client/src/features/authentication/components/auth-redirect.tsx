import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

export const Auth0ProviderWithNavigate: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  // Define the callback function to handle redirection after login
  const onRedirectCallback = (appState?: AppState) => {
    // Navigates to either the URL the user was trying to access before login
    // or the root URL if no such URL exists
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            redirect_uri: window.location.origin
        }}
        onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
