"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2, Users } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  changeUserPlan,
  changeUserRole,
  deleteUser,
} from "@/app/(admin)/admin/users/actions";
import type { Plan, UserRole } from "@/types/database";

export interface AdminUserRow {
  id: string;
  email: string;
  fullName: string | null;
  plan: Plan;
  role: UserRole;
  contractsCount: number;
  createdAt: string;
}

function UserRoleSelect({ user }: { user: AdminUserRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const confirm = () => {
    if (!pendingRole) return;
    startTransition(async () => {
      const result = await changeUserRole(user.id, pendingRole);
      if (!result.success) toast.error(result.error);
      else router.refresh();
      setPendingRole(null);
    });
  };

  return (
    <>
      <Select
        value={user.role}
        onValueChange={(v) => setPendingRole(v as UserRole)}
        disabled={isPending}
      >
        <SelectTrigger size="sm" className="w-24" aria-label={`Change role for ${user.email}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={pendingRole !== null} onOpenChange={(open) => !open && setPendingRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role to {pendingRole}?</DialogTitle>
            <DialogDescription>
              {pendingRole === "admin"
                ? `This gives ${user.email} full access to the admin panel.`
                : `This removes ${user.email}'s admin panel access.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button disabled={isPending} onClick={confirm}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function UserPlanSelect({ user }: { user: AdminUserRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (plan: string | null) => {
    if (!plan) return;
    startTransition(async () => {
      const result = await changeUserPlan(user.id, plan as Plan);
      if (!result.success) toast.error(result.error);
      else router.refresh();
    });
  };

  return (
    <Select value={user.plan} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger size="sm" className="w-24" aria-label={`Change plan for ${user.email}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="team">Team</SelectItem>
      </SelectContent>
    </Select>
  );
}

function DeleteUserButton({ user }: { user: AdminUserRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="icon-sm" aria-label={`Delete ${user.email}`} />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this user?</DialogTitle>
          <DialogDescription>
            This permanently deletes {user.email} and all their contracts, analyses and chat
            history. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" disabled={isPending} onClick={onDelete}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Yes, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UsersTable({
  users,
  emptyTitle,
  emptyDescription,
}: {
  users: AdminUserRow[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  const columns: DataTableColumn<AdminUserRow>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{u.fullName || u.email}</p>
          {u.fullName && <p className="text-muted-foreground truncate text-xs">{u.email}</p>}
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (u) => <UserPlanSelect user={u} />,
    },
    {
      key: "role",
      header: "Role",
      render: (u) => <UserRoleSelect user={u} />,
    },
    {
      key: "contracts",
      header: "Contracts",
      render: (u) => <Badge variant="secondary">{u.contractsCount}</Badge>,
    },
    {
      key: "joined",
      header: "Joined",
      render: (u) =>
        new Date(u.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end">
          <DeleteUserButton user={u} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      emptyIcon={Users}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
