"use client";

import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { ItemData } from "@/hook/useItemTable";
import Link from "next/link";

export function ItemTableRow({ item }: { item: ItemData }) {
  const statusColor =
    item.status === "Active"
      ? "bg-blue-100 text-blue-700"
      : item.status === "InActive"
        ? "bg-orange-100 text-orange-700"
        : item.status === "PreOrder"
          ? "bg-green-100 text-green-700"
          : "bg-muted text-muted-foreground";

  return (
    <TableRow className="hover:bg-muted/50 cursor-pointer transition-colors">
      <TableCell className="px-4 py-2">
        <Input type="checkbox" />
      </TableCell>
      <TableCell className="font-medium">
        <Link href={`/item/${item.id}`}>{item.name}</Link>
      </TableCell>
      <TableCell>
        <Badge className={cn("text-xs", statusColor)}>{item.status}</Badge>{" "}
      </TableCell>
      <TableCell>{item.ItemGroup?.name || "None"}</TableCell>
      <TableCell>{item.unit}</TableCell>
      <TableCell>₹{item.price.toFixed(2)}</TableCell>
      <TableCell className="truncate max-w-[10ch]">{item.sku}</TableCell>
      <TableCell className="text-muted-foreground h-full flex items-center gap-2">
        <Clock className="" />
        <span className="text-sm">
          {formatDistanceToNow(new Date(item.updatedAt), {
            addSuffix: true,
          })}
        </span>
        <Tooltip>
          <TooltipTrigger>
            <MessageCircle className="ml-2 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>Comments not implemented</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Heart className="ml-1 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>Mark favorite (not implemented)</TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
