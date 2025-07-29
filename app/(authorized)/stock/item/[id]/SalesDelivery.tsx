import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Item } from "@/generated/prisma";

export default function SalesDelivery({ item }: { item: Item }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="allowAlternativeItem"
          name="allowAlternativeItem"
          defaultChecked={item.allowAlternativeItem}
        />
        <Label htmlFor="allowAlternativeItem">Allow Alternative Item</Label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="overDeliveryAllowance">Over Delivery Allowance (%)</Label>
          <Input
            id="overDeliveryAllowance"
            name="overDeliveryAllowance"
            type="number"
            defaultValue={item.overDeliveryAllowance}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overBillingAllowance">Over Billing Allowance (%)</Label>
          <Input
            id="overBillingAllowance"
            name="overBillingAllowance"
            type="number"
            defaultValue={item.overBillingAllowance}
          />
        </div>
      </div>
    </div>
  );
}
