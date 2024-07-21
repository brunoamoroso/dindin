import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronRight } from "lucide-react";

const containerMenuVariants = cva("py-4 px-3 flex justify-between text-title", {
  variants: {
    size: {
      md: "",
      lg: ""
    }
  },
  defaultVariants: {
    size: "md"
  }
})

const contentMenuVariants = cva("flex gap-3 items-center", {
  variants: {
    size: {
      md: "label-medium",
      lg: "label-large"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

interface MenuListItemProps{
  size: "md" | "lg",
  children?: React.ReactNode,
  trailingIcon?: boolean,
}

const MenuListItem = ({size, children, trailingIcon = true}: MenuListItemProps) => {
  return (
    <div className={cn(containerMenuVariants({size}))}>
        <div className={cn(contentMenuVariants({size}))}>
            {children}
        </div>
        {trailingIcon && (
          <ChevronRight />
        )}
    </div>
  )
}

export default MenuListItem
