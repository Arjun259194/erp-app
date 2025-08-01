"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ServerAction } from "@/types"
import toast from "react-hot-toast"
import { PlusCircle } from "lucide-react"
import { ItemState } from "@/generated/prisma"

type CreateItemFormProps = {
  createItemAction: ServerAction<
    void,
    Record<string, unknown>
  >
  itemGroups: { id: string; name: string }[]
  reload: () => void
}
const itemStatusOptions = [
  "Active",
  "InActive",
  "OutOfStock",
  "PreOrder",
] satisfies ItemState[]

export function CreateItemForm({
  createItemAction,
  itemGroups,
  reload,
}: CreateItemFormProps) {
  const [formState, setFormState] = useState({
    sku: "",
    name: "",
    description: "",
    unit: "",
    price: "0",
    status: "active",
    itemGroupId: "",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (
    name: string,
    value: string,
  ) => {
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()
    console.log({
      ...formState,
      price: parseFloat(formState.price),
    })

    const promise = createItemAction({
      ...formState,
      price: parseFloat(formState.price),
    })

    toast.promise(promise, {
      loading: "loading...",
      error: error =>
        error.message || "Something went wrong",
      success: () => {
        reload()
        return "Done"
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          name="sku"
          id="sku"
          value={formState.sku}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          value={formState.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>
        <Textarea
          name="description"
          id="description"
          value={formState.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2 col-span-2">
          <Label>Status</Label>
          <Select
            value={formState.status}
            onValueChange={val =>
              handleSelectChange("status", val)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                defaultChecked
                defaultValue="Active"
                placeholder="Select status"
              />
            </SelectTrigger>
            <SelectContent>
              {itemStatusOptions.map(
                (status, index) => (
                  <SelectItem
                    key={index}
                    value={status}
                  >
                    {status}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            name="unit"
            id="unit"
            value={formState.unit}
            onChange={handleChange}
            required
            placeholder="e.g., pcs, kg, liter"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            name="price"
            id="price"
            value={formState.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Item Group</Label>
          <Select
            value={formState.itemGroupId}
            onValueChange={val =>
              handleSelectChange(
                "itemGroupId",
                val,
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select group (optional)" />
            </SelectTrigger>
            <SelectContent>
              {itemGroups.map((group, k) => (
                <SelectItem
                  key={k}
                  value={group.id}
                >
                  {group.name}
                </SelectItem>
              ))}
              <div className="p-1 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={e => {
                    e.preventDefault()
                    // Your create new group logic here
                    console.log(
                      "Create new group clicked",
                    )
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Item Group
                </Button>
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full">
        Create Item
      </Button>
    </form>
  )
}
