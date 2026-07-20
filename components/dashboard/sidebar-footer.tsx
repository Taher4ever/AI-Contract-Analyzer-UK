"use client";

import Link from "next/link";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/types/database";

const planLabels: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};

export function SidebarFooter({
  plan,
  collapsed,
  onToggleCollapse,
}: {
  plan: Plan;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div className="space-y-3">
      {collapsed ? (
        <Badge
          variant="secondary"
          className="mx-auto flex size-8 items-center justify-center rounded-full p-0 text-[10px]"
        >
          {planLabels[plan][0]}
        </Badge>
      ) : (
        <div className="glass shadow-soft rounded-xl p-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="rounded-full">
              {planLabels[plan]} plan
            </Badge>
            {plan !== "team" && (
              <Link
                href="/pricing"
                className="text-primary text-xs font-semibold hover:underline"
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="hidden w-full rounded-xl md:inline-flex"
        onClick={onToggleCollapse}
      >
        {collapsed ? (
          <ChevronsRight className="size-4" />
        ) : (
          <ChevronsLeft className="size-4" />
        )}
      </Button>
    </div>
  );
}
