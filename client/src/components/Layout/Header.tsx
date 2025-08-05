"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES } from "@/lib/routes";
import { noop } from "lodash";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdOutlineViewSidebar } from "react-icons/md";
import { SettingButton } from "./Presentational/SettingButton";
import { AUTHENTICATED } from "./consts";
import { NotificationButton } from "./Presentational/NotificationButton";

export default function Header() {
  const { status } = useSession();
  const location = usePathname();
  const router = useRouter();

  return (
    <header className="h-12 flex justify-between items-center mx-4">
      <div className="flex items-center gap-2">
        {location !== ROUTES.HOME && (
          <Link href={ROUTES.HOME}>
            <Image
              src="/images/logo.png"
              alt="Bin Craft Logo"
              width={24}
              height={24}
            />
          </Link>
        )}
        <MdOutlineViewSidebar
          size={20}
          className="cursor-pointer"
          onClick={noop}
        />
      </div>
      <div className="min-w-[480px] cursor-pointer">
        <InputField
          placeholder="Open"
          className="w-full h-8"
          popoverContent={
            <div className="p-4 text-sm text-muted-foreground"></div>
          }
          icon={<Search className="h-4 w-4" />}
        />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationButton />
        {status === AUTHENTICATED ? (
          <SettingButton />
        ) : (
          <Button
            variant="outline"
            className="w-14 h-7 text-xs"
            onClick={() => router.push(ROUTES.LOGIN)}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
