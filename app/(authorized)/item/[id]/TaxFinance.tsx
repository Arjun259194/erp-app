import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Item } from "@/generated/prisma";

export default function TaxFinance({ item }: { item: Item }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="taxCode">Tax Code</Label>
        <Input id="taxCode" name="taxCode" defaultValue={item.taxCode ?? ""} />
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isZeroRated"
            name="isZeroRated"
            defaultChecked={item.isZeroRated}
          />
          <Label htmlFor="isZeroRated">Zero Rated</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isExempt"
            name="isExempt"
            defaultChecked={item.isExempt}
          />
          <Label htmlFor="isExempt">Exempt</Label>
        </div>
      </div>
    </div>
  );
}
