"use client";

import { ReactNode, useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Home,
  Wallet,
  Package,
  Building2,
  Boxes,
  Landmark,
  Users,
  BadgeDollarSign,
  Factory,
  Handshake,
  ShieldCheck,
  KanbanSquare,
  LifeBuoy,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Topbar } from "./topbar/Topbar";
import { User } from "@/generated/prisma";

// ✅ Your recursive item type
export type SideBarItem =
  | {
    name: string;
    Icon: any;
    children: SideBarItem[];
    link?: never;
  }
  | {
    name: string;
    Icon: any;
    link: string;
    children?: never;
  };

const sidebarItems: SideBarItem[] = [
  { name: "Home", Icon: Home, link: "/home" },
  {
    name: "Accounting",
    Icon: Wallet,
    children: [
      { name: "Paybles", Icon: Wallet, link: "/paybles" },
      { name: "Receivables", Icon: Wallet, link: "/receivables" },
      { name: "Financial Repots", Icon: Landmark, link: "/financial-repots" },
    ],
  },
  { name: "Buying", Icon: Package, link: "/buying" },
  { name: "Selling", Icon: Building2, link: "/selling" },
  { name: "Stock", Icon: Boxes, link: "/stock" },
  { name: "Assets", Icon: Landmark, link: "/assets" },
  {
    name: "HR",
    Icon: Users,
    children: [
      { name: "Recuitment", Icon: Users, link: "/recuitment" },
      { name: "Employee Lifecycle", Icon: Users, link: "/employee-lifecycle" },
      { name: "Performance", Icon: ShieldCheck, link: "/performance" },
      { name: "Shift & Attendance", Icon: BadgeDollarSign, link: "/shiftandattendance" },
      { name: "Expence Claims", Icon: Wallet, link: "/expence-claims" },
      { name: "Leaves", Icon: Package, link: "/leaves" },
    ],
  },
  {
    name: "Payroll",
    Icon: BadgeDollarSign,
    children: [
      { name: "Salary Payout", Icon: BadgeDollarSign, link: "/salary-payout" },
      { name: "Tax& Benefits", Icon: Wallet, link: "/taxandbenefits" },
    ],
  },
  { name: "Manufacturing", Icon: Factory, link: "/manufacturing" },
  { name: "CRM", Icon: Handshake, link: "/CRM" },
  { name: "Quality", Icon: ShieldCheck, link: "/quality" },
  { name: "Projects", Icon: KanbanSquare, link: "/projects" },
  { name: "Support", Icon: LifeBuoy, link: "/support" },
  { name: "ERP Settings", Icon: Settings, link: "/settings" }
];

// ✅ Props
interface Props {
  children: ReactNode;
  user: User
}

// ✅ Main Layout Component
export default function SideBarLayout({ children, user }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      {/* Topbar */}
      <div className="h-14 shrink-0 border-b flex items-center px-4">
        <Button onClick={() => setIsOpen((prev) => !prev)} variant="ghost">
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </Button>

        <h2 className="text-2xl font-semibold text-foreground ml-4">Welcome</h2>
      </div>

      {/* Sidebar + Main */}
      <div className="flex flex-1 min-h-0">
        <Sidebar user={user} items={sidebarItems} isOpen={isOpen} />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

// ✅ Sidebar Component
function Sidebar({ isOpen, items, user }: { isOpen: boolean; user: User; items: SideBarItem[] }) {
  return (
    <aside
      className={`${isOpen ? "w-64" : "hidden"
        } border-r overflow-y-auto px-2 py-4 bg-background`}
    >
      <Items items={items} />
    </aside>
  );
}

// ✅ Render a list of items
function Items({ items }: { items: SideBarItem[] }) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.name} item={item} />
      ))}
    </>
  );
}

// ✅ Single recursive item
function Item({ item }: { item: SideBarItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {item.children ? (
        <>
          <Button
            className="w-full justify-between"
            variant="ghost"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="flex items-center space-x-2">
              <item.Icon className="text-primary" size={16} />
              <span>{item.name}</span>
            </div>
            {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
          <div className="ml-5">
            {open &&
              item.children.map((child) => <Item key={child.name} item={child} />)}
          </div>
        </>
      ) : (
        <Link href={item.link}>
          <Button className="w-full justify-start gap-2" variant="ghost">
            <item.Icon className="text-primary" size={16} />
            {item.name}
          </Button>
        </Link>
      )}
    </div>
  );
}

