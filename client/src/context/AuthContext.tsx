"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserIdFromToken } from "@/lib/utils";

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (session?.token) {
      const extractedUserId = getUserIdFromToken(session.token);
      setUserId(extractedUserId);
      setToken(session.token);
    } else {
      setUserId(null);
      setToken(null);
    }
  }, [session]);

  const value: AuthContextType = {
    userId,
    isLoading: status === "loading",
    isAuthenticated: !!session && !!userId,
    token,
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
