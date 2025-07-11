"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { PublicRegistrationRequest } from "@/generated/prisma";
import { ServerAction } from "@/types";
import { usePublicRegistrationPanel } from "@/hook/usePublicRegistraction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  requests: PublicRegistrationRequest[];
  acceptRequestAction: ServerAction<
    void,
    { id: string; customMessage?: string }
  >;
  rejectRequestAction: ServerAction<
    void,
    { id: string; customMessage?: string }
  >;
  fetchRequests: ServerAction<PublicRegistrationRequest[], void>;
}

export default function PublicRegistrationTable({
  requests,
  ...actions
}: Props) {
  const {
    refresh,
    search,
    loading,
    setSearch,
    filter,
    setFilter,
    selected,
    setSelected,
    message,
    setMessage,
    showPassword,
    setShowPassword,
    filtered,
    acceptRequest,
    rejectRequest,
  } = usePublicRegistrationPanel({
    requests,
    ...actions,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filter} onValueChange={(val) => setFilter(val as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => refresh()} size="icon">
          <RotateCcw className="h-4 w-4 mr-1" />
        </Button>
      </div>

      {loading ? (
        <RegistrationTableSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      r.state === "Pending"
                        ? "secondary"
                        : r.state === "Approved"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {r.state}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelected(r);
                          setMessage("");
                          setShowPassword(false);
                        }}
                      >
                        View
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Review Registration</SheetTitle>
                        <SheetDescription>
                          Review and take action on this registration request.
                        </SheetDescription>
                      </SheetHeader>
                      {selected && (
                        <div className="mt-2 p-5 space-y-6">
                          <div className="grid gap-3">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Name
                              </p>
                              <p className="font-medium text-base">
                                {selected.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Email
                              </p>
                              <p className="font-medium text-base">
                                {selected.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Reason
                              </p>
                              <p className="font-medium text-base whitespace-pre-line">
                                {selected.reason}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="grow">
                                <p className="text-sm text-muted-foreground">
                                  Password
                                </p>
                                <p className="font-mono text-base">
                                  {showPassword
                                    ? selected.password
                                    : "••••••••"}
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="mt-6"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <p className="text-sm text-muted-foreground">
                              Custom Message
                            </p>
                            <Textarea
                              placeholder="Write a custom message for approval or rejection..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                          </div>

                          <div className="flex flex-wrap gap-3 pt-2">
                            <Button
                              disabled={selected.state !== "Pending"}
                              variant="outline"
                              onClick={acceptRequest}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="destructive"
                              disabled={selected.state !== "Pending"}
                              onClick={rejectRequest}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => setMessage("")}
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export function RegistrationTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-8 w-20 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
