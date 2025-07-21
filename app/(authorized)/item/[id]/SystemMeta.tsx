import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// import { Item } from "@prisma/client";
import { Item } from "@/generated/prisma";

export default function SystemMeta({ item }: { item: Item }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDisabled"
          name="isDisabled"
          defaultChecked={item.isDisabled}
        />
        <Label htmlFor="isDisabled">Item Disabled</Label>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        <div>Created: {item.createdAt.toLocaleString()}</div>
        <div>Updated: {item.updatedAt.toLocaleString()}</div>
      </div>
    </div>
  );
}
