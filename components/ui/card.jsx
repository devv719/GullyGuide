import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  decoration = "none",
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "group/card flex flex-col gap-4 bg-paper text-card-foreground border-2 border-foreground p-6 relative",
        "shadow-[3px_3px_0px_0px_rgba(45,45,45,0.1)]",
        decoration === "tape" && "tape-decoration mt-3",
        decoration === "tack" && "tack-decoration mt-4",
        className
      )}
      style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}
      {...props} />
  );
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className
      )}
      {...props} />
  );
}

function CardTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-xl leading-snug font-bold",
        className
      )}
      {...props} />
  );
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-base text-muted-foreground font-body", className)}
      {...props} />
  );
}

function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props} />
  );
}

function CardContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-content"
      className={cn("font-body", className)}
      {...props} />
  );
}

function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center border-t-2 border-dashed border-foreground/20 pt-4 mt-2",
        className
      )}
      {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
