import UserAdminPanel from "@/components/UserAdminPanel"
import { auth } from "@/lib/auth"
import { DB } from "@/lib/database"
import { redirect } from "next/navigation"

export default async function page() {
  const [user, error] = await auth()
  if (error) redirect("/auth/login?message=" + encodeURIComponent(error));
  if (user.role !== "Admin") redirect("/home?message=" + encodeURIComponent("Not authorized"));

  const users = await DB.FetchAllUsers();

  return (
    <>
      <UserAdminPanel users={users} />
    </>
  )
}

