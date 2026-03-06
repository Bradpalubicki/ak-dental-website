import Image from "next/image";
import { CheckCircle, Clock, XCircle, Globe, Tag } from "lucide-react";

interface AssetCardProps {
  id: string;
  blobUrl: string;
  status: "pending" | "approved" | "rejected" | "published";
  photoType?: string | null;
  serviceCategory?: string | null;
  placement?: string | null;
  aiCategory?: string | null;
  createdAt: string;
  rejectionReason?: string | null;
}

const STATUS_CONFIG = {
  pending:   { icon: Clock,       color: "text-yellow-600 bg-yellow-50 border-yellow-200",  label: "Pending Review" },
  approved:  { icon: CheckCircle, color: "text-blue-600 bg-blue-50 border-blue-200",        label: "Approved" },
  rejected:  { icon: XCircle,     color: "text-red-600 bg-red-50 border-red-200",           label: "Rejected" },
  published: { icon: Globe,       color: "text-green-600 bg-green-50 border-green-200",     label: "Published" },
};

export function AssetCard({
  blobUrl,
  status,
  photoType,
  serviceCategory,
  placement,
  aiCategory,
  createdAt,
  rejectionReason,
}: AssetCardProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        <Image src={blobUrl} alt="Uploaded photo" fill className="object-cover" />
      </div>
      <div className="p-3 space-y-2">
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
          <Icon className="h-3.5 w-3.5" />
          {cfg.label}
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          {(photoType || aiCategory) && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span className="capitalize">{photoType ?? aiCategory}</span>
              {serviceCategory && <span>· {serviceCategory}</span>}
            </div>
          )}
          {placement && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span className="capitalize">{placement.replace(/_/g, " ")}</span>
            </div>
          )}
          <div className="text-gray-400">
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
        {status === "rejected" && rejectionReason && (
          <p className="text-xs text-red-600 bg-red-50 rounded p-1.5">{rejectionReason}</p>
        )}
      </div>
    </div>
  );
}
