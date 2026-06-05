"use client";

import { toast } from "sonner";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RolesPermissionsSettings } from "@/lib/types";

export function RolesPermissionsCard({ data }: { data: RolesPermissionsSettings }) {
  return (
    <Card>
      <CardHeader className="border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-secondary" />
              Roles &amp; Permissions
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Role hierarchy, permission groups, and operator access control.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Operator invitation is not connected in this preview.")}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite Operator
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-primary">
          Operator accounts can only be created by Super Admins. Public sign-up is disabled.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-white/5 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-semibold">Role</th>
                <th className="py-2 pr-4 font-semibold">Users</th>
                <th className="py-2 pr-4 font-semibold">Description</th>
                <th className="py-2 font-semibold">Permission Groups</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.roles.map((role) => (
                <tr key={role.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-medium text-foreground">{role.name}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {role.userCount}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{role.description}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {role.permissionGroups.map((pg) => {
                        const group = data.permissionGroups.find((g) => g.id === pg);
                        return (
                          <span
                            key={pg}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                          >
                            {group?.name ?? pg}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

