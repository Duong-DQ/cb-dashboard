import { cn } from "@/lib/utils";

const steps = ["1 Chọn file", "2 Khoá và đích", "3 Ánh xạ cột", "4 Xem trước"];

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Các bước import">
      {steps.map((s, i) => (
        <li key={s} aria-current={i === current ? "step" : undefined} className={cn("rounded-full px-3.5 py-2 text-[13px] font-semibold", i === current ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/80")}>{s}</li>
      ))}
    </ol>
  );
}
