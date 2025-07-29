"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UserRole, UserStatus } from "@/generated/prisma";

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  form: UserFormData;
  setForm: (val: UserFormData) => void;
  editing: boolean;
  onSave: () => void;
};

export default function UserDialog({ open, setOpen, form, setForm, editing, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{editing ? "Edit User" : "Create User"}</DialogTitle>
        <DialogDescription>
          {editing ? "Update user details." : "Enter details for a new user."}
        </DialogDescription>
        <div className="grid gap-3 mt-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <Select
            value={form.role}
            onValueChange={val => setForm({ ...form, role: val as UserRole })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Admin",
                "User",
                "Accountant",
                "Sales",
                "Purchase",
                "HR",
                "Manufacturing",
                "ProjectManager",
                "Support",
              ].map(role => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={form.status}
            onValueChange={val => setForm({ ...form, status: val as UserStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {["Active", "Inactive", "Suspended", "Pending"].map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
