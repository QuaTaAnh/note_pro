"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserIdFromToken } from "@/lib/utils";

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasuraToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasuraToken, setHasuraToken] = useState<string | null>(null);

  useEffect(() => {
    if (session?.hasuraToken) {
      const extractedUserId = getUserIdFromToken(session.hasuraToken);
      setUserId(extractedUserId);
      setHasuraToken(session.hasuraToken);
    } else {
      setUserId(null);
      setHasuraToken(null);
    }
  }, [session]);

  const value: AuthContextType = {
    userId,
    isLoading: status === "loading",
    isAuthenticated: !!session && !!userId,
    hasuraToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
