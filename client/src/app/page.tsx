"use client";

import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 py-16">
      <h2 className="text-3xl font-semibold">Welcome to Note Pro</h2>
      <p className="text-gray-600 mt-2">Your personal note-taking assistant.</p>
      {status === "authenticated" && (
        <p className="text-lg mt-4">
          Hello, {session?.user?.name}! Ready to take some notes?
        </p>
      )}
    </div>
  );
}
