import * as React from "react"

import { cn } from "@/lib/utils"

function Alert({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        "relative w-full border-2 border-foreground p-4 font-body text-foreground",
        variant === "destructive" && "border-accent text-accent bg-accent/5",
        className
      )}
      style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      {...props} />
  );
}

function AlertDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-base font-body [&_p]:leading-relaxed", className)}
      {...props} />
  );
}

export { Alert, AlertDescription }
