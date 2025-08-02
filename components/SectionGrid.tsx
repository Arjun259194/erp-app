import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

type LinkItem = {
  label: string
  href: string
}

type Section = {
  title: string
  links: LinkItem[]
}

export type SectionGroup = {
  heading: string
  sections: Section[]
}

type SectionGridProps = {
  pageTitle?: string
  groups: SectionGroup[]
  className?: string
}

export function SectionGrid({
  pageTitle,
  groups,
  className = "",
}: SectionGridProps) {
  return (
    <div className={`p-6 ${className}`}>
      {pageTitle ? (
        <h1 className="text-2xl font-bold mb-6">
          {pageTitle}
        </h1>
      ) : null}
      {groups.map(group => (
        <div
          key={group.heading}
          className="mb-10"
        >
          <h2 className="text-xl font-semibold mb-4">
            {group.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {group.sections.map(section => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm hover:underline-offset-2 text-secondary-foreground underline-offset-1 underline"
                      >
                        {link.label}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
