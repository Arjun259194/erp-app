"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeDialog } from "@/components/theme/ModeDialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  logoutAction: () => Promise<void>;
}

export function UserMenu({ logoutAction }: Props) {
  const router = useRouter();
  const [openThemeDialog, setOpenThemeDialog] = useState(false);

  const logoutOnSelect = () => {
    toast.promise(logoutAction(), {
      loading: "loading...",
      error: err => {
        return err.message || "something went wrong";
      },
      success: () => {
        router.push("/auth/login?message=" + encodeURIComponent("You have been logged out"));
        return "Logged out";
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => setOpenThemeDialog(true)}>
            Toggle Theme
          </DropdownMenuItem>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={logoutOnSelect}> Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeDialog open={openThemeDialog} onOpenChange={setOpenThemeDialog} />
    </>
  );
}
