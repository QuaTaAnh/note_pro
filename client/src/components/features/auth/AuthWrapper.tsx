"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PageLoading } from "@/components/ui/loading";

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthWrapper({
  children,
  fallback = <PageLoading />,
}: AuthWrapperProps) {
  const { status } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (status !== "loading") {
      document.documentElement.setAttribute("data-auth-ready", "true");
    }
  }, [status]);

  useEffect(() => {
    if (isHydrated && status !== "loading") {
      document.documentElement.setAttribute("data-auth-ready", "true");
    }
  }, [isHydrated, status]);

  return !isHydrated || status === "loading" ? (
    <div className="auth-loading">{fallback}</div>
  ) : (
    <div className="auth-ready">{children}</div>
  );
}
