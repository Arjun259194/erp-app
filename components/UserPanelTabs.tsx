// components/TabsAdminPanel.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobalSettings, PublicRegistrationRequest, User } from "@/generated/prisma";
import UserAdminPanel from "./UserAdminPanel";
import RegisterRequestPanel from "./RegisterRequestPanel";
import { ServerAction } from "@/types";

interface Props {
  users: User[];
  settings: GlobalSettings | null;
  requests: PublicRegistrationRequest[];
  acceptRequestAction: ServerAction<void, { id: string; customMessage?: string }>;
  rejectRequestAction: ServerAction<void, { id: string; customMessage?: string }>;
  fetchRequests: ServerAction<PublicRegistrationRequest[], void>;
}

export default function TabsAdminPanel({ users, settings, requests, ...actions }: Props) {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="settings">Register Request</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <UserAdminPanel users={users} />
      </TabsContent>

      <TabsContent value="settings">
        {!settings?.public_registration ? (
          <div>Public registraction is not available</div>
        ) : (
          <RegisterRequestPanel {...actions} requests={requests} />
        )}
      </TabsContent>
    </Tabs>
  );
}
