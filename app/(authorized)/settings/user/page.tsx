import TabsAdminPanel from "@/components/UserPanelTabs";
import { auth } from "@/lib/auth";
import { DB } from "@/lib/database";
import { redirect } from "next/navigation";
import { acceptRegistractionRequest, rejectRegistractionRequest } from "./action";

export default async function page() {
  const [user, error] = await auth();
  if (error) redirect("/auth/login?message=" + encodeURIComponent(error));
  if (user.role !== "Admin") redirect("/home?message=" + encodeURIComponent("Not authorized"));

  const [users, settings, requests] = await Promise.all([
    DB.FetchAllUsers(),
    DB.GetSettings(),
    DB.GetAllRegisterRequests(),
  ]);

  return (
    <TabsAdminPanel
      {...{
        users,
        settings,
        requests,
      }}
      acceptRequestAction={acceptRegistractionRequest}
      rejectRequestAction={rejectRegistractionRequest}
      fetchRequests={async () => {
        "use server";
        return await DB.GetAllRegisterRequests();
      }}
    />
  );
}
