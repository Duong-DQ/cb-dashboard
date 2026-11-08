import { statusLabel, type Status } from "@/lib/mock";

const color: Record<Status, string> = {
  match: "bg-emerald-700",
  conflict: "bg-orange-700",
  pending: "bg-blue-600",
  hris_only: "bg-slate-400",
  missing: "bg-white border border-slate-400",
};
const order: Status[] = ["match", "conflict", "pending", "hris_only", "missing"];

export function StatusBar({ counts }: { counts: Record<Status, number> }) {
  const total = order.reduce((n, k) => n + counts[k], 0);
  return (
    <div>
      <div className="flex h-4 gap-0.5 overflow-hidden rounded" role="img" aria-label={order.map((k) => `${statusLabel[k]} ${counts[k]}`).join(", ")}>
        {order.map((k) => (
          <div key={k} className={color[k]} style={{ width: `${(counts[k] / total) * 100}%` }} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {order.map((k) => `${counts[k].toLocaleString("vi-VN")} ${statusLabel[k].toLowerCase()}`).join(" · ")}
      </p>
    </div>
  );
}

export function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {order.map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <i className={`inline-block size-2.5 rounded-sm ${color[k]}`} />
          {statusLabel[k]}
        </span>
      ))}
    </div>
  );
}
