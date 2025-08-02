"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ServerAction } from "@/types"
import {
  MaterialRequestData,
  useMaterialRequestTable,
} from "@/hook/useMaterialRequestTable"
import { MaterialRequestTableHeader } from "./MaterialRequestTableHeaderProps"
import { MaterialRequestTableRow } from "./MaterialRequestTableRow"

export function MaterialRequestTable({
  materialRequests: initialMaterialRequests,
  departments,
  costCenters,
  fetchMaterialRequestsAction:
    fetchMaterialRequests,
  createMaterialRequestAction,
}: {
  materialRequests: MaterialRequestData[]
  departments: { id: string; name: string }[]
  costCenters: { id: string; name: string }[]
  fetchMaterialRequestsAction: ServerAction<
    MaterialRequestData[],
    void
  >
  createMaterialRequestAction: ServerAction<
    void,
    Record<string, unknown>
  >
}) {
  const {
    materialRequests,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    departmentFilter,
    setDepartmentFilter,
    refreshMaterialRequests,
  } = useMaterialRequestTable(
    initialMaterialRequests,
    fetchMaterialRequests,
  )

  //TODO Complete this componet

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <MaterialRequestTableHeader
          reload={refreshMaterialRequests}
          createMaterialRequestAction={
            createMaterialRequestAction
          }
          departments={departments}
          costCenters={costCenters}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={
            setPriorityFilter
          }
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={
            setDepartmentFilter
          }
        />

        <ScrollArea className="border rounded-xl">
          <Table className="w-full text-sm">
            <TableHeader className="bg-muted text-muted-foreground">
              <TableRow className="text-left">
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  Request Number
                </TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>
                  Required Date
                </TableHead>
                <TableHead>Items Count</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialRequests.map(
                materialRequest => (
                  <MaterialRequestTableRow
                    key={materialRequest.id}
                    materialRequest={
                      materialRequest
                    }
                  />
                ),
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}
