import { MessageDialog } from "@/components/MessageDialog"
import SideBarLayout from "@/components/Sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"


interface Props {
  children: ReactNode
}

export default async function AuthorizedLayout({ children }: Props) {
  const [user, error] = await auth()
  if (error !== null) redirect("/auth/login?message=" + encodeURIComponent(error))

  console.log("User: ", user)

  return <>
    <div className="h-screen">
      <MessageDialog />
      <SideBarLayout user={user}>
        {children}
      </SideBarLayout>
    </div>
  </>
}
