import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CreateItemForm } from "./CreateItemForm";
import { ServerAction } from "@/types";

export function ItemTableHeader({
  search,
  onSearchChange,
  filterStatus,
  onFilterChange,
  onGroupChange,
  group,
  reload,
  groups,
  createItemAction,
}: {
  createItemAction: ServerAction<void, Record<string, unknown>>;
  search: string;
  onSearchChange: (val: string) => void;
  filterStatus: string | null;
  onFilterChange: (val: string | null) => void;
  onGroupChange: (val: string | null) => void;
  group: string | null;
  groups: {id: string, name: string}[];
  reload: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Input
        placeholder="Search items by name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />

      <div className="flex items-center gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={filterStatus ?? ""}
          onValueChange={(value) =>
            onFilterChange(value === "All" ? null : value)
          }
        >
          <SelectTrigger id="status" className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Enabled">Enabled</SelectItem>
            <SelectItem value="Template">Template</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="status">Group by</Label>
        <Select
          value={group ?? ""}
          onValueChange={(value) =>
            onGroupChange(value === "All" ? null : value)
          }
        >
          <SelectTrigger id="status" className="w-[160px]">
            <SelectValue placeholder="All groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {groups.map((g, k) => {
              return (
                <SelectItem key={k} value={g.id}>
                  {g.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>New</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create new item</DialogTitle>
          <CreateItemForm
            reload={reload}
            createItemAction={createItemAction}
            itemGroups={groups}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
