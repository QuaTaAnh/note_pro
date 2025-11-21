"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

export type SharedUser = {
  id: string;
  email: string;
  name?: string;
  role: "viewer" | "editor";
  avatar_url?: string;
};

interface SharedUsersListProps {
  users: SharedUser[];
  onRoleChange: (userId: string, newRole: "viewer" | "editor") => void;
  onRemoveUser: (userId: string) => void;
  currentUserId?: string;
  canManageUsers?: boolean;
}

export function SharedUsersList({
  users,
  onRoleChange,
  onRemoveUser,
  currentUserId,
  canManageUsers = false,
}: SharedUsersListProps) {
  return users.length === 0 ? null : (
    <div className="mt-4 space-y-2">
      {users.map((user) => {
        const isCurrentUser = currentUserId === user.id;
        return (
          <div
            key={user.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {user.avatar_url && (
                <Image
                  src={user.avatar_url}
                  alt="User avatar"
                  className="rounded-full object-contain"
                  width={32}
                  height={32}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.name || user.email.split("@")[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={user.role}
                onValueChange={(value: "viewer" | "editor") =>
                  onRoleChange(user.id, value)
                }
                disabled={isCurrentUser || !canManageUsers}
              >
                <SelectTrigger className="w-[110px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              {!isCurrentUser && canManageUsers && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onRemoveUser(user.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
