import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/lib/routes";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdEmojiObjects } from "react-icons/md";

export const SettingButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="relative">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <img
            src={session?.user?.image ?? "/images/no_image.jpg"}
            alt="avatar"
            className="w-6 h-6 rounded-full cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col items-center gap-2">
              <img
                src={session?.user?.image ?? "/images/no_image.jpg"}
                alt="avatar"
                className="w-8 h-8 rounded-full"
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
          <DropdownMenuItem onClick={() => router.push(ROUTES.DEMO)}>
            <MdEmojiObjects />
            Demo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl: ROUTES.HOME,
                redirect: true,
              })
            }
          >
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
