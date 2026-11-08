import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusLabel, type Status } from "@/lib/mock";

const tone: Record<string, string> = {
  match: "bg-emerald-50 text-emerald-800 border-emerald-200",
  conflict: "bg-orange-50 text-orange-800 border-orange-200",
  pending: "bg-blue-50 text-blue-800 border-blue-200",
  hris_only: "bg-slate-100 text-slate-700 border-slate-200",
  missing: "bg-red-50 text-red-800 border-red-200",
  green: "bg-emerald-50 text-emerald-800 border-emerald-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  blue: "bg-blue-50 text-blue-800 border-blue-200",
  orange: "bg-orange-50 text-orange-800 border-orange-200",
  red: "bg-red-50 text-red-800 border-red-200",
};

export function StatusBadge({ status, label }: { status: Status | "green" | "neutral" | "blue" | "orange" | "red"; label?: string }) {
  const text = label ?? statusLabel[status as Status];
  return (
    <Badge variant="outline" className={cn("rounded-full font-semibold", tone[status])}>
      {text}
    </Badge>
  );
}
