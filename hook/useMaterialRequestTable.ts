// hook/useMaterialRequestTable.ts
import { useState, useCallback, useMemo } from "react";
import { ServerAction } from "@/types";

export interface MaterialRequestData {
  id: string;
  requestNumber: number;
  requester: {
    id: string;
    name: string;
  };
  department?: {
    id: string;
    name: string;
  };
  costCenter?: {
    id: string;
    name: string;
  };
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVED"
    | "ORDERED"
    | "RECEIVED"
    | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  purpose?: string;
  requiredDate: string;
  items: MaterialRequestItemData[];
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequestItemData {
  id: string;
  item: {
    id: string;
    code: string;
    name: string;
  };
  quantity: number;
  uom: string;
  estimatedCost?: number;
}

export function useMaterialRequestTable(
  initialMaterialRequests: MaterialRequestData[],
  fetchMaterialRequestsAction: ServerAction<MaterialRequestData[], void>
) {
  const [materialRequests, setMaterialRequests] = useState<
    MaterialRequestData[]
  >(initialMaterialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const refreshMaterialRequests = useCallback(async () => {
    const updatedMaterialRequests = await fetchMaterialRequestsAction();
    setMaterialRequests(updatedMaterialRequests);
  }, [fetchMaterialRequestsAction]);

  const filteredMaterialRequests = useMemo(() => {
    return materialRequests.filter((mr) => {
      const matchesSearch =
        mr.requestNumber.toString().includes(search.toLowerCase()) ||
        mr.requester.name.toLowerCase().includes(search.toLowerCase()) ||
        mr.purpose?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || mr.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || mr.priority === priorityFilter;
      const matchesDepartment =
        departmentFilter === "all" || mr.department?.id === departmentFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesDepartment
      );
    });
  }, [
    materialRequests,
    search,
    statusFilter,
    priorityFilter,
    departmentFilter,
  ]);

  return {
    materialRequests: filteredMaterialRequests,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    departmentFilter,
    setDepartmentFilter,
    refreshMaterialRequests,
  };
}
