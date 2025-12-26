"use client";

import { Input } from "@/components/ui/input";
import { useSearchUsersByEmailLazyQuery } from "@/graphql/queries/__generated__/user.generated";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import differenceBy from "lodash/differenceBy";

export type UserSearchResult = {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
};

interface UserEmailAutocompleteProps {
  onSelectUser: (user: UserSearchResult) => void;
  excludeUserIds?: string[];
  placeholder?: string;
}

export function UserEmailAutocomplete({
  onSelectUser,
  excludeUserIds = [],
  placeholder = "Add emails to invite",
}: UserEmailAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchUsers, { data, loading }] = useSearchUsersByEmailLazyQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        searchUsers({
          variables: {
            searchTerm: `%${searchTerm}%`,
          },
        });
        setIsOpen(true);
      }, 300),
    [searchUsers],
  );

  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setIsOpen(false);
      debouncedSearch.cancel();
      return;
    }

    debouncedSearch(inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return differenceBy(
      data.users,
      excludeUserIds.map((id) => ({ id })),
      "id",
    );
  }, [data, excludeUserIds]);

  const handleSelectUser = (user: UserSearchResult) => {
    onSelectUser(user);
    setInputValue("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="email"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => {
          if (filteredUsers.length > 0 && inputValue.length >= 2) {
            setIsOpen(true);
          }
        }}
        className="w-full"
      />

      {isOpen && filteredUsers.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover dark:bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {loading ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              Searching...
            </div>
          ) : (
            <div className="py-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center gap-3 px-2 py-1 hover:bg-accent transition-colors text-left"
                >
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
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen &&
        !loading &&
        filteredUsers.length === 0 &&
        inputValue.length >= 2 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-popover dark:bg-card border border-border rounded-md shadow-lg"
          >
            <div className="p-3 text-sm text-muted-foreground text-center">
              No users found
            </div>
          </div>
        )}
    </div>
  );
}
