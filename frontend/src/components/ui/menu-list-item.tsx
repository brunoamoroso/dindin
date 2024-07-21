import { ChevronRight } from "lucide-react";

interface MenuListItemProps{
  children?: React.ReactNode
}

const MenuListItem = ({children}: MenuListItemProps) => {
  return (
    <div className="py-4 px-3 flex justify-between text-title">
        <div className="flex gap-3 items-center label-medium">
            {children}
        </div>
        <ChevronRight />
    </div>
  )
}

export default MenuListItem
