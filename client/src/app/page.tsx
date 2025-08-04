"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b shadow bg-white flex justify-between items-center">
        <h1 className="text-lg font-bold">Note Pro 📝</h1>
        {status === "authenticated" ? (
          <div className="flex items-center space-x-4">
            <img
              src={session?.user?.image ?? ""}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600">{session?.user?.name}</span>
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
      </header>

      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-semibold">Welcome to Note Pro</h2>
        <p className="text-gray-600 mt-2">
          Your personal note-taking assistant.
        </p>
      </main>

      <footer className="p-4 border-t text-center text-gray-400 text-sm">
        © 2025 Note Pro. All rights reserved.
      </footer>
    </div>
  );
}
