import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Hash,
  Tag,
  User,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { MerchantDetail } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Row({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | undefined | null;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm text-foreground font-medium break-words ${
            mono ? "font-mono text-[13px]" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

interface MerchantProfileCardProps {
  merchant: MerchantDetail;
}

export function MerchantProfileCard({ merchant }: MerchantProfileCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Building2 className="size-4 text-primary" />
            Business Profile
          </CardTitle>
          <StatusPill status={merchant.status} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-1">
          <Row icon={Building2} label="Legal Name" value={merchant.legalName} />
          <Row
            icon={Hash}
            label="Registration No."
            value={merchant.registrationNumber}
            mono
          />
          <Row icon={Tag} label="Category" value={merchant.category} />
          {merchant.taxId && (
            <Row icon={Hash} label="Tax ID" value={merchant.taxId} mono />
          )}
        </div>

        {merchant.address && (
          <Row
            icon={MapPin}
            label="HQ Address"
            value={`${merchant.address}, ${merchant.city}, ${merchant.country}`}
          />
        )}
        {!merchant.address && (
          <Row
            icon={MapPin}
            label="Location"
            value={`${merchant.city}, ${merchant.country}`}
          />
        )}
        {merchant.website && (
          <Row icon={Globe} label="Website" value={merchant.website} />
        )}

        <div className="flex flex-wrap gap-6 pt-3 mt-1 border-t border-white/[0.06]">
          <a
            href={`mailto:${merchant.email}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="size-4" />
            {merchant.email}
          </a>
          {merchant.phone && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" />
              {merchant.phone}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 mt-3 border-t border-white/[0.06]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Assigned Reviewer
            </p>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              {merchant.assignedReviewer ?? "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Created
            </p>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Calendar className="size-3.5 text-muted-foreground" />
              {formatDate(merchant.createdAt)}
            </p>
          </div>
          {merchant.updatedAt && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Last Updated
              </p>
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                {formatDate(merchant.updatedAt)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

