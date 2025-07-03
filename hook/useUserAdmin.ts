"use client"

import { useMemo, useState } from "react"
import { User, UserRole, UserStatus } from "@/generated/prisma"

export type UserFormData = {
  name: string
  email: string
  password: string
  role: UserRole
  status: UserStatus
}

export function useUserAdmin(initialUsers: User[]) {
  const [users] = useState<User[]>(initialUsers)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "User",
    status: "Active",
  })

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All")
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All")

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === "All" || user.role === roleFilter
      const matchStatus = statusFilter === "All" || user.status === statusFilter
      return matchSearch && matchRole && matchStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    })
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    console.log("Delete user", id)
    // TODO: await fetch(`/api/users/${id}`, { method: "DELETE" })
  }

  const handleSave = async () => {
    if (editingUser) {
      console.log("Update user", editingUser.id, form)
      // TODO: await fetch(`/api/users/${editingUser.id}`, { method: "PATCH", body: JSON.stringify(form) })
    } else {
      console.log("Create user", form)
      // TODO: await fetch(`/api/users`, { method: "POST", body: JSON.stringify(form) })
    }

    setOpen(false)
    setEditingUser(null)
    setForm({ name: "", email: "", password: "", role: "User", status: "Active" })
  }

  const handleAdd = () => {
    setEditingUser(null)
    setForm({ name: "", email: "", password: "", role: "User", status: "Active" })
    setOpen(true)
  }

  return {
    users: filteredUsers,
    form,
    setForm,
    open,
    setOpen,
    editing: !!editingUser,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    handleEdit,
    handleDelete,
    handleSave,
    handleAdd,
  }
}

