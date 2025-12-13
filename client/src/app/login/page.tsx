"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLoading, PageLoading } from "@/components/ui/loading";
import { AUTHENTICATED } from "@/consts";
import { ROUTES } from "@/lib/routes";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function LoginPage() {
  const { status } = useSession();
  const { workspaceSlug, loading: workspaceLoading } = useWorkspace();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === AUTHENTICATED && workspaceSlug && !workspaceLoading) {
      router.replace(ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug));
    }
  }, [status, workspaceSlug, workspaceLoading, router]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return status === AUTHENTICATED ? (
    <div
      className="flex items-center justify-center min-h-screen"
      role="status"
      aria-label="Loading"
    >
      <PageLoading />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(rgb(18,18,18)_0%,rgb(30,42,54)_100%)]">
      <Card className="w-full max-w-md bg-[#090a0b] border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo.png"
              alt="Bin Craft Logo"
              width={56}
              height={56}
            />
          </div>
          <CardTitle className="text-2xl font-medium text-white">
            Welcome to Bin Craft
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full gap-2 bg-[#374151] border-[#4b5563] text-[#f4f4f4] hover:bg-[#4b5563] hover:border-[#374151] hover:text-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <ButtonLoading>Signing in...</ButtonLoading>
            ) : (
              <>
                <FcGoogle size={20} />
                Continue with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
