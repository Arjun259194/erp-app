"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

interface Crumb {
  title: string
  href: string
}

function generateBreadcrumbs(
  pathname: string,
): Crumb[] {
  const pathWithoutQuery = pathname.split("?")[0]
  const pathArray = pathWithoutQuery
    .split("/")
    .filter(Boolean)

  const breadcrumbs: Crumb[] = [
    { title: "Home", href: "/" },
  ]

  pathArray.forEach((segment, idx) => {
    const href =
      "/" + pathArray.slice(0, idx + 1).join("/")
    const title = segment
      .replace(/-/g, " ")
      .replace(/^\w/, c => c.toUpperCase())
    breadcrumbs.push({ title, href })
  })

  return breadcrumbs
}

export default function DynamicBreadcrumb() {
  const pathname = usePathname()
  const breadcrumbs =
    generateBreadcrumbs(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, idx) => {
          const isLast =
            idx === breadcrumbs.length - 1
          const isHome = idx === 0

          return (
            <div
              key={crumb.href}
              className="flex items-center"
            >
              <BreadcrumbItem>
                {isLast ? (
                  isHome ? (
                    <BreadcrumbPage aria-label="Home">
                      <Home className="h-4 w-4" />
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbPage>
                      {crumb.title}
                    </BreadcrumbPage>
                  )
                ) : isHome ? (
                  <BreadcrumbLink
                    asChild
                    aria-label="Home"
                  >
                    <Link href={crumb.href}>
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>
                      {crumb.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
