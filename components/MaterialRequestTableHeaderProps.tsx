// components/MaterialRequestTableHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServerAction } from "@/types";

interface MaterialRequestTableHeaderProps {
  reload: () => void;
  createMaterialRequestAction: ServerAction<void, Record<string, unknown>>;
  departments: { id: string; name: string }[];
  costCenters: { id: string; name: string }[];
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (v: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (v: string) => void;
}

export function MaterialRequestTableHeader({
  reload,
  createMaterialRequestAction,
  departments,
  costCenters,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
}: MaterialRequestTableHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between space-y-2">
      <div className="flex space-x-2">
        <Button onClick={reload}>Refresh</Button>
        <Button
          onClick={() => {
            console.log("Creating new material request");
          }}
        >
          New Request
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search requests..."
          value={search}
          onChange={e => onSearchChange(e.currentTarget.value)}
          className="min-w-[200px]"
        />

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="ORDERED">Ordered</SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>

        <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {departments.map(d => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
