import { useState } from "react";
import { Item, ItemGroup } from "@/generated/prisma";
import { ServerAction } from "@/types";

export type ItemData = Item & {
  ItemGroup: ItemGroup | null;
};

export function useItemTable(
  initialItems: ItemData[],
  fetchItems: ServerAction<ItemData[], void>,
) {
  const [items, setItems] = useState<ItemData[]>(initialItems);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterStatus || item.status === filterStatus) &&
      (!group || item.ItemGroup?.name === group),
  );

  const refreshItems = async () => {
    try {
      const data = await fetchItems();
      setItems((_) => data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  return {
    items: filteredItems,
    rawItems: items,
    setItems,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    group,
    setGroup,
    refreshItems,
  };
}
