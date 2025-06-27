import { MessageDialog } from "@/components/MessageDialog";
import SideBarLayout from "@/components/Sidebar";

export default async function Page() {
  return (
    <div className="h-screen">
      <MessageDialog />
      <SideBarLayout>
        <ul className="bg-red-500/50">
          {Array.from({ length: 50 }).map((_, i) => (
            <li key={i}>hello from main container</li>
          ))}
        </ul>
      </SideBarLayout>
    </div>
  );
}

