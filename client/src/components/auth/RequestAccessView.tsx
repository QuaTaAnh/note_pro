"use client";

import { useLogout } from "@/hooks";
import { useBinCraftTitle } from "@/hooks/use-bin-craft-title";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { FiLock } from "react-icons/fi";
import { Button } from "../ui/button";

export function RequestAccessView() {
  const { logout, isLoggingOut } = useLogout();
  const { data: session } = useSession();

  useBinCraftTitle({
    dynamicTitle: "Bin Craft Document",
  });

  const handleRequestAccess = () => {
    alert("Request access functionality would be implemented here");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <FiLock className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <h1 className="text-xl font-medium text-foreground">
          Request access to this document
        </h1>

        <p className="text-muted-foreground">
          You can view this document once your request is approved.
        </p>

        <Button
          variant="default"
          size="sm"
          className="gap-2 text-sm rounded-xl w-full"
          onClick={handleRequestAccess}
        >
          <FiLock />
          Request Access
        </Button>

        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p>
            You are logged in as{" "}
            <span className="font-medium">{session?.user?.email}</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm rounded-xl"
            onClick={logout}
            disabled={isLoggingOut}
          >
            <LogOut />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
