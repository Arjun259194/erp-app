import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const sections = [
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
  {
    title: "Email / Notifications",
    links: [{ label: "Email Template", href: "/settings/email-template" }],
  },
  {
    title: "Workflow",
    links: [{ label: "Workflow Action", href: "/settings/workflow" }],
  },
];

export default async function page() {
  const [user, error] = await auth()
  if (error !== null) redirect("/auth/login?message=" + encodeURIComponent(error))

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm hover:underline text-blue-600"
                  >
                    {link.label}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </li>
              ))}

            </ul>
          </div>
        ))}
        {
          user.role === "Admin"
            ? <>
              <div>
                <h2 className="text-lg font-semibold mb-2">Admin Options</h2>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/settings/system"
                      className="flex items-center gap-2 text-sm hover:underline text-blue-600"
                    >
                      System Settings
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings/user"
                      className="flex items-center gap-2 text-sm hover:underline text-blue-600"
                    >
                      User Managment
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </li>

                </ul>
              </div>
            </>
            : null
        }

      </div>
    </div>
  );
}

