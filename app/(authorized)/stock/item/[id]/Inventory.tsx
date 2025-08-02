import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
// import { Item } from "@prisma/client";
import { Item } from "@/generated/prisma"

export default function Inventory({
  item,
}: {
  item: Item
}) {
  const fields = [
    {
      id: "maintainStock",
      label: "Maintain Stock",
    },
    { id: "hasVariants", label: "Has Variants" },
    { id: "isFixedAsset", label: "Fixed Asset" },
  ]

  return (
    <div className="space-y-4">
      {fields.map(({ id, label }) => (
        <div
          key={id}
          className="flex items-center space-x-2"
        >
          <Checkbox
            id={id}
            name={id}
            defaultChecked={
              item[id as keyof Item] as boolean
            }
          />
          <Label htmlFor={id}>{label}</Label>
        </div>
      ))}
    </div>
  )
}
