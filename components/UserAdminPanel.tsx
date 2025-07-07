"use client"

import { User } from "@/generated/prisma"
import UserTable from "./UserTable"
import UserDialog from "./UserDialog"
import UserToolbar from "./UserToolbar"
import { useUserAdmin } from "@/hook/useUserAdmin"
import { createUser, fetchUsers, deleteUser, updateUser } from "@/actions/user"

type Props = {
  users: User[]
}

export default function UserAdminPanel({ users: initialUsers }: Props) {
  const {
    refresh,
    users,
    form, setForm,
    open, setOpen,
    editing,
    search, setSearch,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    handleEdit,
    handleDelete,
    handleSave,
    handleAdd,
  } = useUserAdmin(initialUsers, {
    createUser,
    updateUser,
    deleteUser,
    fetchUsers
  })

  return (
    <div className="space-y-2 text-sm">
      <UserToolbar
        refresh={refresh}
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddClick={handleAdd}
      />
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      <UserDialog
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        editing={editing}
        onSave={handleSave}
      />
    </div>
  )
}

