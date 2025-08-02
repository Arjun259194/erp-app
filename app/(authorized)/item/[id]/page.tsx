import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import BasicInfo from "./BasicInfo"
import Inventory from "./Inventory"
import SalesDelivery from "./SalesDelivery"
import TaxFinance from "./TaxFinance"
import Manufacturing from "./Manufacturing"
import SystemMeta from "./SystemMeta"
import { DB } from "@/lib/database"
import { notFound } from "next/navigation"
import { basicAction } from "@/actions/items/basic"
import { inventoryAction } from "@/actions/items/inventory"
import { salesAction } from "@/actions/items/sales"
import { taxAction } from "@/actions/items/tax"
import { mfgAction } from "@/actions/items/manufacturing"
import { metaAction } from "@/actions/items/meta"
import { Button } from "@/components/ui/button"

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const item = await DB.GetItemById(
    (await params).id,
  )
  if (!item) notFound()
  const itemGroups = await DB.GetAllItemGroups()

  return (
    <Tabs
      defaultValue="basic"
      className="space-y-8"
    >
      <TabsList>
        <TabsTrigger value="basic">
          Basic Info
        </TabsTrigger>
        <TabsTrigger value="inventory">
          Inventory
        </TabsTrigger>
        <TabsTrigger value="sales">
          Sales &amp; Delivery
        </TabsTrigger>
        <TabsTrigger value="tax">
          Tax/Finance
        </TabsTrigger>
        <TabsTrigger value="manufacturing">
          Manufacturing
        </TabsTrigger>
        <TabsTrigger value="meta">
          System
        </TabsTrigger>
      </TabsList>

      {/* — Basic — */}
      <TabsContent value="basic">
        <form action={basicAction}>
          <h2 className="text-lg font-semibold mb-4">
            Basic Information
          </h2>
          <input
            type="hidden"
            name="id"
            value={item.id}
          />
          <BasicInfo
            item={item}
            itemGroups={itemGroups}
          />
          <SaveBar />
        </form>
      </TabsContent>

      {/* — Inventory — */}
      <TabsContent value="inventory">
        <form action={inventoryAction}>
          <h2 className="text-lg font-semibold mb-4">
            Inventory Settings
          </h2>
          <input
            type="hidden"
            name="id"
            value={item.id}
          />{" "}
          {/* ← Add this line */}
          <Inventory item={item} />
          <SaveBar />
        </form>
      </TabsContent>

      {/* — Sales & Delivery — */}
      <TabsContent value="sales">
        <form action={salesAction}>
          <h2 className="text-lg font-semibold mb-4">
            Sales &amp; Delivery
          </h2>
          <input
            type="hidden"
            name="id"
            value={item.id}
          />{" "}
          <SalesDelivery item={item} />
          <SaveBar />
        </form>
      </TabsContent>

      {/* — Tax / Finance — */}
      <TabsContent value="tax">
        <form action={taxAction}>
          <h2 className="text-lg font-semibold mb-4">
            Tax &amp; Finance
          </h2>
          <input
            type="hidden"
            name="id"
            value={item.id}
          />{" "}
          <TaxFinance item={item} />
          <SaveBar />
        </form>
      </TabsContent>

      {/* — Manufacturing — */}
      <TabsContent value="manufacturing">
        <form action={mfgAction}>
          <h2 className="text-lg font-semibold mb-4">
            Manufacturing
          </h2>
          <input
            type="hidden"
            name="id"
            value={item.id}
          />{" "}
          <Manufacturing item={item} />
          <SaveBar />
        </form>
      </TabsContent>

      {/* — System — */}
      <TabsContent value="meta">
        <form action={metaAction}>
          <h2 className="text-lg font-semibold mb-4">
            System Metadata
          </h2>
          <input
            type="hidden"
            name="id"
            value={item.id}
          />{" "}
          <SystemMeta item={item} />
          <SaveBar />
        </form>
      </TabsContent>
    </Tabs>
  )
}

/* Re-usable save bar keeps old button styling */
function SaveBar() {
  return (
    <div className="flex justify-end pt-6">
      <Button
        type="submit"
        className="btn btn-primary px-6 py-2"
      >
        Save
      </Button>
    </div>
  )
}
