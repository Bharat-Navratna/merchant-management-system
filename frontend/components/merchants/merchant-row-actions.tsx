"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type MerchantRowActionsProps = {
  merchantId: string;
};

export function MerchantRowActions({ merchantId }: MerchantRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1" onClick={(event) => event.stopPropagation()}>
      <Button asChild variant="ghost" size="sm">
        <Link href={`/merchants/${merchantId}`}>View</Link>
      </Button>
      <button
        type="button"
        className="merchantops-focus flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
        aria-label="More merchant actions"
        onClick={() => toast.info("Additional merchant actions are available from the merchant detail page.")}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
}

