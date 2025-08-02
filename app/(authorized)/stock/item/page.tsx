import { ItemTable } from "@/components/ItemTable"
import { DB } from "@/lib/database"
import { getallitems } from "./action"

export default async function page() {
  const [items, groups] = await Promise.all([
    DB.GetAllItems(),
    DB.GetAllItemGroups(),
  ])

  return (
    <ItemTable
      fetchItemsAction={getallitems}
      groups={groups.map(({ name, id }) => ({
        name,
        id,
      }))}
      items={items}
    />
  )
}
