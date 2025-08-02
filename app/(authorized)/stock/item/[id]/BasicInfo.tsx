import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Item,
  ItemGroup,
} from "@/generated/prisma"

export default function BasicInfo({
  item,
  itemGroups,
}: {
  item: Item
  itemGroups: ItemGroup[]
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            name="sku"
            defaultValue={item.sku}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={item.name}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="itemGroupId">
          Item Group
        </Label>
        <select
          name="itemGroupId"
          defaultValue={item.itemGroupId ?? ""}
          className="w-full border rounded-md p-2 text-sm"
        >
          <option value="">
            Select group (optional)
          </option>
          {itemGroups.map(group => (
            <option
              key={group.id}
              value={group.id}
            >
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>
        <Input
          id="description"
          name="description"
          defaultValue={item.description ?? ""}
        />
      </div>
    </div>
  )
}
