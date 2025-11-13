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
        const themePreferences: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes('_theme_preference')) {
            themePreferences[key] = localStorage.getItem(key) || '';
          }
        }

        localStorage.clear();
        sessionStorage.clear();
        
        Object.entries(themePreferences).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });

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