"use client";

import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { ORDER_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setStatus = (status: string) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Order marked as ${status}`);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error ?? "Failed to update status");
      }
    });
  };

  const currentIndex = STEPS.indexOf(currentStatus);
  const isCancelled = currentStatus === "CANCELLED";

  return (
    <div>
      {!isCancelled && (
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    i <= currentIndex
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {i < currentIndex ? <Check className="size-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    i <= currentIndex ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 mb-5 h-0.5 flex-1 rounded-full transition-colors",
                    i < currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isCancelled && (
        <div className="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
          This order has been cancelled.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s.value}
            disabled={isPending || s.value === currentStatus}
            onClick={() => setStatus(s.value)}
            className={cn(
              "rounded-md border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer disabled:cursor-not-allowed",
              s.value === currentStatus
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted disabled:opacity-50"
            )}
          >
            {isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
