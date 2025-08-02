// import { Item } from "@prisma/client";
import { Item } from "@/generated/prisma"

export default function Manufacturing({
  item,
}: {
  item: Item
}) {
  // Extend with BOM, production, etc. as your schema grows.
  return (
    <div className="space-y-2">
      <div className="text-muted-foreground text-sm">
        Manufacturing/BOM fields can be added here
        as your workflow evolves.
      </div>
    </div>
  )
}
