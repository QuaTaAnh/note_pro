"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
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
            onClick={() => signIn("google")}
            className="w-full gap-2 bg-[#374151] border-[#4b5563] text-[#f4f4f4] hover:bg-[#4b5563] hover:border-[#374151] hover:text-[#f4f4f4]"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
