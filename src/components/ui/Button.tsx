import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-emerald text-white hover:bg-emerald-light shadow-glow-sm hover:shadow-glow",
        primary:
          "btn-liquid text-white font-semibold",
        destructive:
          "bg-red-500/90 text-white hover:bg-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)]",
        outline:
          "border border-white/10 bg-transparent hover:bg-white/5 hover:border-emerald/50 text-neutral-300 hover:text-white",
        secondary:
          "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5",
        ghost:
          "hover:bg-white/5 hover:text-white text-neutral-400",
        link:
          "text-emerald underline-offset-4 hover:underline hover:text-emerald-light",
        emerald:
          "bg-emerald/10 text-emerald border border-emerald/20 hover:bg-emerald/20 hover:border-emerald/40",
        glass:
          "glass-panel text-neutral-300 hover:text-white hover:border-white/20",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
