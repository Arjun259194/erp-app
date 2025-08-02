"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, RotateCcw } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  UserRole,
  UserStatus,
} from "@/generated/prisma"

type Props = {
  refresh: () => Promise<void>
  search: string
  setSearch: (val: string) => void
  roleFilter: UserRole | "All"
  setRoleFilter: (val: UserRole | "All") => void
  statusFilter: UserStatus | "All"
  setStatusFilter: (
    val: UserStatus | "All",
  ) => void
  onAddClick: () => void
}

const roles = [
  "All",
  "Admin",
  "User",
  "Accountant",
  "Sales",
  "Purchase",
  "HR",
  "Manufacturing",
  "ProjectManager",
  "Support",
] as const
const statuses = [
  "All",
  "Active",
  "Inactive",
  "Suspended",
  "Pending",
] as const

export default function UserToolbar({
  refresh,
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onAddClick,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Input
        placeholder="Search name/email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="h-8 max-w-sm"
      />
      <div className="flex items-center gap-2">
        <Select
          value={roleFilter}
          onValueChange={val =>
            setRoleFilter(val as UserRole | "All")
          }
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={val =>
            setStatusFilter(
              val as UserStatus | "All",
            )
          }
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem
                key={status}
                value={status}
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          className="aspect-square flex items-center justify-center"
          onClick={refresh}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
        </Button>

        <Button
          size="sm"
          className="h-8 px-3"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  )
}
