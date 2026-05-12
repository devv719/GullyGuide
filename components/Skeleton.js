import { cn } from "@/lib/utils";

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/60 border-2 border-dashed border-foreground/10 relative overflow-hidden",
        className
      )}
      style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}
      {...props}
    />
  );
}
