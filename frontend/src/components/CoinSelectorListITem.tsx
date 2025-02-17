import { Check, Trash } from "lucide-react";
import { IconButton } from "./ui/icon-button";
import { cn } from "@/lib/utils";

interface CoinListItemProps {
    isDefault?: boolean;
    id: string;
    img: string;
    desc: string;
    code: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function CoinSelectorListItem({id, isDefault=false, img, desc, code, onClick}: CoinListItemProps){
    return(
        <div className="flex flex-1 gap-4 items-center pl-2 py-3.5 pr-4" onClick={onClick} data-id={id}>
            <Check className={cn("text-neutral-50", `${!isDefault && "opacity-0"}`)} size={16}/>
            <img
                src={img}
                alt="coin"
                className="w-7 h-7 object-cover rounded-full">
                
            </img>
            <div className="flex flex-1 flex-col">
                <span className="label-large text-title">{code}</span>
                <span className="body-small text-subtle">
                    {desc}
                </span>
            </div>
            <IconButton variant='ghost' size='small'>
                <Trash />
            </IconButton>
        </div>
    )
}