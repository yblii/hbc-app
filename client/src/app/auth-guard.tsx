import { useAuth0 } from "@auth0/auth0-react";
import { type ComponentType, useEffect } from "react";

interface AuthenticationGuardProps {
  component: ComponentType;
}

export const AuthenticationGuard = ({ component: Component }: AuthenticationGuardProps) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    // 1. If we are done loading and NOT authenticated, redirect.
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.pathname,
        },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  // 2. While checking, or if redirecting, show a loader.
  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // 3. If authenticated, render the component safely.
  return <Component />;
};