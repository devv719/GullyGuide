import * as React from "react"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value = 0,
  ...props
}) {
  return (
    <div
      data-slot="progress"
      className={cn(
        "relative h-3 w-full overflow-hidden border-2 border-foreground bg-muted/30",
        className
      )}
      style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      {...props}
    >
      <div
        className="h-full bg-foreground transition-all duration-500"
        style={{
          width: `${Math.min(value, 100)}%`,
          borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
        }}
      />
    </div>
  );
}

export { Progress }
