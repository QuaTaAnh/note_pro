"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <header className="p-4 shadow-sm bg-background border-b border-border flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <h1 className="text-lg font-bold text-foreground">Note Pro 📝</h1>
      </Link>
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        {status === "authenticated" ? (
          <div className="flex items-center space-x-4">
            <img
              src={session?.user?.image ?? ""}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-muted-foreground">
              {session?.user?.name}
            </span>
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
