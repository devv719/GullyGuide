import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 border-2 border-foreground bg-paper px-4 py-2 text-lg font-body text-foreground transition-colors placeholder:text-foreground/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50",
        className
      )}
      style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      {...props} />
  );
}

export { Input }
