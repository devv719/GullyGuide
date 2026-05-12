import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-body text-lg font-normal transition-all duration-100 select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 border-[3px] border-foreground btn-press cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-paper text-foreground shadow-sketch hover:bg-accent hover:text-white hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        secondary:
          "bg-muted text-foreground shadow-sketch hover:bg-secondary hover:text-white hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        destructive:
          "bg-paper text-accent border-accent shadow-sketch-accent hover:bg-accent hover:text-white hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        outline:
          "bg-transparent text-foreground border-[2px] border-foreground shadow-none hover:bg-muted hover:shadow-sketch-hover hover:translate-x-[1px] hover:translate-y-[1px]",
        ghost:
          "bg-transparent text-foreground border-transparent shadow-none hover:border-dashed hover:border-foreground/30",
        link:
          "text-secondary border-transparent shadow-none underline underline-offset-4 decoration-wavy decoration-accent decoration-2 hover:text-accent",
      },
      size: {
        default: "h-12 gap-2 px-6 py-2",
        xs: "h-8 gap-1 px-3 text-sm",
        sm: "h-10 gap-1.5 px-4 text-base",
        lg: "h-14 gap-2 px-8 text-xl",
        icon: "size-10 p-0",
        "icon-xs": "size-8 p-0 text-sm",
        "icon-sm": "size-9 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      {...props} />
  );
}

export { Button, buttonVariants }
