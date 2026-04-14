import { cn } from "@/lib/utils";

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-800/50 backdrop-blur-sm relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Deep Shimmer effect layer across the dark skeleton block */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
    </div>
  );
}
