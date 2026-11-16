import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export function ExpiryPill({
  status,
  days,
}: {
  status?: "VALID" | "EXPIRING_SOON" | "EXPIRED";
  days?: number | null;
}) {
  if (!status) return null;

  if (status === "EXPIRED") {
    return (
      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
        <AlertCircle className="w-3 h-3 text-rose-600" />
        <span>Expired</span>
      </span>
    );
  }

  if (status === "EXPIRING_SOON") {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Expires in {days ?? 7}d</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
      <span>Valid Certificate</span>
    </span>
  );
}
