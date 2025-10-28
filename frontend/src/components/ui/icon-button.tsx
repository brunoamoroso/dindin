import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const IconButtonVariants = cva(
  "group relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary border-green-700 shadow-button",
        ghost: "bg-transparent text-primary",
        outline: "bg-secondary shadow-button text-on-secondary",
      },
      size: {
        default: "h-10 w-10 label-small peer [&>svg]:h-6 [&>svg]:w-6",
        small: "h-10 w-10 label-small peer [&>svg]:h-4 [&>svg]:w-4",
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
    VariantProps<typeof IconButtonVariants> {
  asChild?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(IconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        <span className='group-hover:block hidden absolute rounded-full inset-0 bg-state-hover' />
      </Comp>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, IconButtonVariants }
