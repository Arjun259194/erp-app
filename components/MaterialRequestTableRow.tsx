// components/MaterialRequestTableRow.tsx
"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "./ui/table";
import { MaterialRequestData } from "@/hook/useMaterialRequestTable";

interface MaterialRequestTableRowProps {
  materialRequest: MaterialRequestData;
}

export function MaterialRequestTableRow({ materialRequest }: MaterialRequestTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Link className="text-blue-600 hover:underline" href={`/material-request/${materialRequest.id}`}>
        View
        </Link>
      </TableCell>
      <TableCell>{materialRequest.requestNumber}</TableCell>
      <TableCell>{materialRequest.requester.name}</TableCell>
      <TableCell>{materialRequest.department?.name ?? "-"}</TableCell>
      <TableCell>
        <Badge variant="outline">{materialRequest.status}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{materialRequest.priority}</Badge>
      </TableCell>
      <TableCell>{format(new Date(materialRequest.requiredDate), "dd MMM yyyy")}</TableCell>
      <TableCell>{materialRequest.items.length}</TableCell>
      <TableCell>{format(new Date(materialRequest.createdAt), "dd MMM yyyy")}</TableCell>
    </TableRow>
  );
}
