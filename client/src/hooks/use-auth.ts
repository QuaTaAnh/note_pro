"use client";

import { useAuth as useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const auth = useAuthContext();
  
  return {
    ...auth,
    isLoggedIn: auth.isAuthenticated,
    getUserId: () => auth.userId,
    getToken: () => auth.hasuraToken,
  };
};

export const useUserId = () => {
  const { userId } = useAuthContext();
  return userId;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated;
};

export const useHasuraToken = () => {
  const { hasuraToken } = useAuthContext();
  return hasuraToken;
}; 