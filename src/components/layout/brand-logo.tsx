import Link from "next/link";

import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/constants";

export function BrandLogo({
  className,
  showDot = true,
  href = "/",
}: {
  className?: string;
  showDot?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${BRAND_NAME} — Home`}
      className="group inline-flex items-center gap-2.5"
    >
      <span
        className={cn(
          "text-xl font-extrabold uppercase tracking-tight text-foreground transition-opacity duration-300 group-hover:opacity-80 sm:text-2xl",
          className
        )}
      >
        {BRAND_NAME}
      </span>
      {showDot && (
        <span className="size-2 shrink-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
      )}
    </Link>
  );
}
