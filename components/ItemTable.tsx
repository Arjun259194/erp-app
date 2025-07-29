"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ItemTableHeader } from "./ItemTableHeader";
import { ItemTableRow } from "./ItemTableRow";
import { ServerAction } from "@/types";
import { ItemData, useItemTable } from "@/hook/useItemTable";
import createItem from "@/app/(authorized)/stock/item/action";

export function ItemTable({
  items: initialItems,
  groups,
  fetchItemsAction: fetchItems,
}: {
  items: ItemData[];
  groups: { id: string; name: string }[];
  fetchItemsAction: ServerAction<ItemData[], void>;
}) {
  const { items, search, setSearch, filterStatus, setFilterStatus, group, setGroup, refreshItems } =
    useItemTable(initialItems, fetchItems);

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <ItemTableHeader
          reload={refreshItems}
          createItemAction={createItem}
          group={group}
          groups={groups}
          search={search}
          onSearchChange={setSearch}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          onGroupChange={setGroup}
        />

        <ScrollArea className="border rounded-xl">
          <Table className="w-full text-sm">
            <TableHeader className="bg-muted text-muted-foreground">
              <TableRow className="text-left">
                <TableHead className="w-12"></TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <ItemTableRow key={item.id} item={item} />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
