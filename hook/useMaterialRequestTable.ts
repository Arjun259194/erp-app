// hook/useMaterialRequestTable.ts

import {
  useState,
  useCallback,
  useMemo,
} from "react"

import type { Prisma } from "@/generated/prisma" // or '@prisma/client'

import { ServerAction } from "@/types"

// Define Prisma include types for the hook
export type MaterialRequestData =
  Prisma.MaterialRequestGetPayload<{
    include: {
      requester: {
        select: {
          id: true
          name: true
        }
      }
      department: {
        select: {
          id: true
          name: true
        }
      }
      costCenter: {
        select: {
          id: true
          name: true
        }
      }
      items: {
        include: {
          item: {
            select: {
              id: true
              sku: true
              name: true
            }
          }
        }
      }
    }
  }>

export type MaterialRequestItemData =
  Prisma.MaterialRequestItemGetPayload<{
    include: {
      item: {
        select: {
          id: true
          sku: true
          name: true
        }
      }
    }
  }>

export function useMaterialRequestTable(
  initialMaterialRequests: MaterialRequestData[],
  fetchMaterialRequestsAction: ServerAction<
    MaterialRequestData[],
    void
  >,
) {
  const [materialRequests, setMaterialRequests] =
    useState<MaterialRequestData[]>(
      initialMaterialRequests,
    )
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] =
    useState("all")
  const [priorityFilter, setPriorityFilter] =
    useState("all")
  const [departmentFilter, setDepartmentFilter] =
    useState("all")

  const refreshMaterialRequests =
    useCallback(async () => {
      const updatedMaterialRequests =
        await fetchMaterialRequestsAction()
      setMaterialRequests(
        updatedMaterialRequests as any,
      )
    }, [fetchMaterialRequestsAction])

  const filteredMaterialRequests = useMemo(() => {
    return materialRequests.filter(mr => {
      const matchesSearch =
        mr.requestNumber
          .toString()
          .includes(search.toLowerCase()) ||
        mr.requester.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        mr.purpose
          ?.toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        mr.status === statusFilter

      const matchesPriority =
        priorityFilter === "all" ||
        mr.priority === priorityFilter

      const matchesDepartment =
        departmentFilter === "all" ||
        mr.department?.id === departmentFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDepartment
      )
    })
  }, [
    materialRequests,
    search,
    statusFilter,
    priorityFilter,
    departmentFilter,
  ])

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
  }
}
