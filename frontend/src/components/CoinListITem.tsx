import { Check, Trash } from "lucide-react";
import { IconButton } from "./ui/icon-button";

interface CoinListItemProps {
    img: string;
    desc: string;
    code: string;
}

export function CoinListItem({img, desc, code}: CoinListItemProps){
    return(
        <div className="flex flex-1 gap-4 items-center pl-2 py-3.5 pr-4">
            <Check className="text-neutral-50" size={16}/>
            <img
                src={`${
                    import.meta.env.VITE_BACKEND_URL
                }/assets/coin-covers/${img}`}
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