"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { deleteAccount } from "@/app/(app)/dashboard/settings/actions";

export function DeleteAccountDialog() {
  const [pending, startTransition] = useTransition();

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" className="mt-4 rounded-full" />}>
        <Trash2 className="size-4" />
        Delete account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently deletes your account, contracts and analyses. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await deleteAccount();
                if (result?.error) toast.error(result.error);
              })
            }
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Yes, delete my account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
