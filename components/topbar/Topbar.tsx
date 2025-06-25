// components/topbar/Topbar.tsx
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "./UserMenu";
import logout from "@/actions/logout";

export function Topbar() {
  return (
    <div className="h-14 w-full px-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
        <h1 className="text-lg font-semibold">Home</h1>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search or type a command (Ctrl + G)"
          className="w-[320px] h-9"
        />
        <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
        <UserMenu logoutAction={logout} />
      </div>
    </div>
  );
}

