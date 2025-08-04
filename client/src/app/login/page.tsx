"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-10">
          <h2 className="text-2xl font-semibold mb-6">Login to Note Pro</h2>
          <Button
            variant="outline"
            onClick={() => signIn("google")}
            className="w-full gap-2"
          >
            <FcGoogle size={20} /> Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
