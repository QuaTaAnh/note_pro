"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

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
      <Card className="w-1/3 max-w-md rounded-lg bg-[#090a0b] border-none">
        <CardContent
          className="flex flex-col items-center gap-6"
          style={{
            padding: "24px",
          }}
        >
          <h2 className="text-center text-2xl font-medium leading-relaxed break-words select-none text-[#f4f4f4]">
            Welcome to Note Pro
          </h2>

          <Button
            variant="outline"
            onClick={() => signIn("google")}
            className="w-1/2 rounded-sm p-[6px] text-sm flex justify-center cursor-pointer text-[#f4f4f4] bg-[#374151] border-[#4b5563] hover:bg-[#4b5563] hover:border-[#374151] hover:text-[#f4f4f4]"
          >
            <FcGoogle size={20} className="mr-[10px]" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
