import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SectionGrid } from "@/components/SectionGrid";

const groups = [
  {
    heading: "General Settings",
    sections: [
      {
        title: "Your Shortcuts",
        links: [
          { label: "Accounts Settings", href: "/settings/accounts" },
          { label: "Stock Settings", href: "/settings/stock" },
          { label: "Buying Settings", href: "/settings/buying" },
        ],
      },
      {
        title: "Module Settings",
        links: [
          { label: "Accounts Settings", href: "/settings/accounts" },
          { label: "Stock Settings", href: "/settings/stock" },
          { label: "Buying Settings", href: "/settings/buying" },
          { label: "CRM Settings", href: "/settings/CRM" },
        ],
      },
    ],
  },
  {
    heading: "Communications",
    sections: [
      {
        title: "Email / Notifications",
        links: [{ label: "Email Template", href: "/settings/email-template" }],
      },
    ],
  },
  {
    heading: "Automation",
    sections: [
      {
        title: "Workflow",
        links: [{ label: "Workflow Action", href: "/settings/workflow" }],
      },
    ],
  },
];

const adminGroups = [
  {
    heading: "Admin settings",
    sections: [
      {
        title: "System settings",
        links: [
          { href: "/settings/system", label: "system settings" },
          { label: "User managment", href: "/settings/user" },
        ],
      },
    ],
  },
];

export default async function page() {
  const [user, error] = await auth();
  if (error !== null) redirect("/auth/login?message=" + encodeURIComponent(error));

  return <SectionGrid groups={[...(user ? adminGroups : []), ...groups]} pageTitle="Settings" />;
}
