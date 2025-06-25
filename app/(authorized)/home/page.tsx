import { MessageDialog } from "@/components/MessageDialog"
import { Topbar } from "@/components/topbar/Topbar"

export default async function page() {
  return <>
    <MessageDialog />
    <Topbar />
  </>
}
