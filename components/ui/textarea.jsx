import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-[80px] w-full border-2 border-foreground bg-paper px-4 py-3 text-lg font-body text-foreground transition-colors placeholder:text-foreground/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 resize-none",
        className
      )}
      style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}
      {...props} />
  );
}

export { Textarea }
