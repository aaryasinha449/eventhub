import type { ReactNode } from "react";

export function StatCard({
  label, value, hint, icon, trend,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  trend?: { value: string; direction: "up" | "down" | "flat" };
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="font-display text-3xl font-semibold tracking-tight">{value}</p>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.direction === "up" ? "text-[color:var(--success)]"
              : trend.direction === "down" ? "text-[color:var(--destructive)]"
              : "text-muted-foreground"
            }`}
          >
            {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"} {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
