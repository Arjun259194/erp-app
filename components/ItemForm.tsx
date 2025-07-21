"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ItemData } from "@/hook/useItemTable";

type ItemFormProps = {
  item: ItemData;
};

export default function ItemForm({ item }: ItemFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ItemData>({
    defaultValues: item,
  });

  const onSubmit = (data: ItemData) => {
    console.log("Submitted:", data);
    // perform save or trigger server action
  };

  return (
    <section className="p-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register("sku")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" {...register("unit")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          {[
            ["isDisabled", "Disabled"],
            ["allowAlternativeItem", "Allow Alternative Item"],
            ["maintainStock", "Maintain Stock"],
            ["hasVariants", "Has Variants"],
            ["isFixedAsset", "Is Fixed Asset"],
            ["isZeroRated", "Is Zero Rated"],
            ["isExempt", "Is Exempt"],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={watch(key as keyof ItemData) as boolean}
                onCheckedChange={(checked) =>
                  setValue(key as keyof ItemData, !!checked)
                }
              />
              <Label htmlFor={key}>{label}</Label>
            </div>
          ))}
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="overDeliveryAllowance">
              Over Delivery Allowance (%)
            </Label>
            <Input
              id="overDeliveryAllowance"
              type="number"
              step="0.001"
              {...register("overDeliveryAllowance", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overBillingAllowance">
              Over Billing Allowance (%)
            </Label>
            <Input
              id="overBillingAllowance"
              type="number"
              step="0.001"
              {...register("overBillingAllowance", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxCode">Tax Code</Label>
            <Input id="taxCode" {...register("taxCode")} />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </section>
  );
}
