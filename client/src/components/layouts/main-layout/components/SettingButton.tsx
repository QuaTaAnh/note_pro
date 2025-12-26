import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLogout } from "@/hooks/useLogout";
import Image from "next/image";

export const SettingButton = () => {
  const { data: session } = useSession();
  const { logout, isLoggingOut } = useLogout();

  return (
    <div className="relative">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Image
            src={session?.user?.image ?? "/images/no_image.jpg"}
            alt="avatar"
            width={24}
            height={24}
            className="w-6 h-6 rounded-full cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col items-center gap-2">
              <Image
                src={session?.user?.image ?? "/images/no_image.jpg"}
                alt="avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full cursor-pointer"
              />
              <p className="text-sm font-medium leading-none">
                {session?.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.email ?? "No email"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} disabled={isLoggingOut}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
