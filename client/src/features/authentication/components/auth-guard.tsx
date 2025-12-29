import { useAuth0 } from "@auth0/auth0-react";
import { type ComponentType, useEffect, useState } from "react";
import { getUserInfo } from "../api/get-user";
import { completeUserProfile } from "../api/complete-user";
import type { User } from "../../../Types";

interface AuthenticationGuardProps {
  component: ComponentType;
}

export const AuthenticationGuard = ({ component: Component }: AuthenticationGuardProps) => {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // 1. If we are done loading and NOT authenticated, redirect.
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.pathname,
        },
      });
      setLoading(false);
    }

    const checkUserProfile = async () => {
        if(isAuthenticated) {
            try {
                const currUser = await getUserInfo(getAccessTokenSilently);
                setUser(currUser);
            } catch(err) {
                console.log("Problem getting user profile: " + err);
            } finally {
                setLoading(false);
            }
        }
    }

    checkUserProfile();
  }, [isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently]);

  const handleOnboardingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        if(!user) {
            console.error("User not logged in");
            return;
        }

        const userProfile = await completeUserProfile(formData.firstName, formData.lastName, getAccessTokenSilently);
        setUser({ ...user, firstName: userProfile.firstName, lastName: userProfile.lastName });
    } catch(err) {
        console.log("Problem updating user profile: " + err);
    }  finally {
        setLoading(false);
    }
  }

  // 2. While checking, or if redirecting, show a loader.
  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  if(!user?.firstName) {
    return (
      <div className="onboarding-container">
        <h2>Welcome! Let's finish your profile.</h2>
        <form onSubmit={handleOnboardingSubmit}>
          <input 
            placeholder="First Name" 
            value={formData.firstName}
            onChange={e => setFormData({...formData, firstName: e.target.value})} 
            required 
          />
          <input 
            placeholder="Last Name" 
            value={formData.lastName}
            onChange={e => setFormData({...formData, lastName: e.target.value})} 
            required 
          />
          <button type="submit">Complete Setup</button>
        </form>
      </div>
    );
  }

  // 3. If authenticated, render the component safely.
  return <Component />;
};