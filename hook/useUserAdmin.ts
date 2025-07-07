"use client";

import { useMemo, useState } from "react";
import { User, UserRole, UserStatus } from "@/generated/prisma";
import { ServerAction } from "@/types";
import toast from "react-hot-toast";

export type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

type PropsActions = {
  createUser: ServerAction;
  updateUser: ServerAction;
  deleteUser: ServerAction;
  fetchUsers: ServerAction<User[], undefined>
};

export function useUserAdmin(initialUsers: User[], actions: PropsActions) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "User",
    status: "Active",
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "All" || user.role === roleFilter;
      const matchStatus =
        statusFilter === "All" || user.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const refresh = async () => {
    try {
      const newUsers = await actions.fetchUsers(undefined);
      setUsers(newUsers);
    } catch (err) {
      console.error("Failed to refresh users:", err);
      toast.error("Failed to refresh user list");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete user", id);

    const formdata = new FormData();
    formdata.set("id", id);

    toast.promise(actions.deleteUser(formdata), {
      loading: "Deleting...",
      success: () => {
        return  "User deleted successfully!"
      },
      error: (err) => {
        console.error(err);
        return err.message || "Failed to delete user.";
      },
    });

    await refresh()
  };

  const handleSave = async () => {
    const formdata = new FormData();
    formdata.set("name", form.name);
    formdata.set("email", form.email);
    formdata.set("role", form.role);
    formdata.set("status", form.status);
    if (form.password) formdata.set("password", form.password);

    let promise: Promise<void>;

    if (editingUser) {
      console.log("Update user", editingUser.id, form);
      formdata.set("id", editingUser.id);
      promise = actions.updateUser(formdata);
    } else {
      console.log("Create user", form);
      promise = actions.createUser(formdata);
    }

    toast.promise(promise, {
      loading: "Saving...",
      success: () => {
        setOpen(false);
        setEditingUser(null);
        setForm({
          name: "",
          email: "",
          password: "",
          role: "User",
          status: "Active",
        });
        return "User saved successfully!";
      },
      error: (err) => {
        console.error(err);
        return err.message || "Failed to save user.";
      },
    });

    await refresh()
  };

  const handleAdd = () => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "User",
      status: "Active",
    });
    setOpen(true);
  };

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
    refresh 
  };
}
