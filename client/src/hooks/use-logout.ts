import { ROUTES } from "@/lib/routes";
import showToast from "@/lib/toast";
import { signOut } from "next-auth/react";
import { useCallback, useState } from "react";

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        document.documentElement.removeAttribute('data-auth-ready');
      }

      await signOut({
        callbackUrl: ROUTES.LOGIN,
        redirect: true,
      });

      showToast.success("Successfully signed out");
    } catch (error) {
      console.error("Logout error:", error);
      showToast.error("Failed to sign out. Redirecting to login...");
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  return {
    logout,
    isLoggingOut,
  };
} 