import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import { Separator } from "./separator";

const containerMenuVariants = cva("py-4 px-3 flex justify-between text-content-primary", {
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
  dataId?: string;
  size?: "md" | "lg";
  children?: React.ReactNode;
  trailingIcon?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  value?: string;
  separator?: boolean;
  disabled?: boolean;
}

const MenuListItem = ({dataId, size = "md", children, trailingIcon = true, onClick, value, separator = false, disabled = false}: MenuListItemProps) => {
  return (
    <div onClick={onClick} data-id={dataId} data-value={value} data-disabled={disabled} className={"data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"}>
      <div className={cn(containerMenuVariants({size}))} >
          <div className={cn(contentMenuVariants({size}))}>
              {children}
          </div>
          {trailingIcon && (
            <ChevronRight />
          )}
      </div>
          {separator && (
          <Separator /> 
          )}
    </div>
  )
}

export default MenuListItem
