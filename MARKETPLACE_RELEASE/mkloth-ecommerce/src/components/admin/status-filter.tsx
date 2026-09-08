"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

export function StatusFilter({ current }: { current?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setStatus = (value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setStatus(undefined)}
        className={cn(
          "rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer",
          !current
            ? "border-primary bg-primary text-primary-foreground"
            : "hover:bg-muted"
        )}
      >
        All
      </button>
      {ORDER_STATUSES.map((s) => (
        <button
          key={s.value}
          onClick={() => setStatus(s.value)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer",
            current === s.value
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
