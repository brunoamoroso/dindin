import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface CoinListItemProps {
    id: string;
    variant?: "default" | "add" | "pressed";
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const coinSelectionVariants = cva(
    "relative flex gap-2 items-end h-[152px] w-[140px] rounded-lg p-6 snap-start shrink-0 text-content-subtle label-medium",
    {
        variants:{
            variant: {
                default: "shadow-button",
                add: "border-2 border-outline border-dashed",
                pressed: "bg-primary shadow-button-pressed text-primary border border-primary",
            }
        },
        defaultVariants: {
            variant: "default",
        }
    }
);

export function CoinSelectorItem({id, variant = "default", children, onClick}: CoinListItemProps){
    return(
        <div className={cn(coinSelectionVariants({variant}))} onClick={onClick} data-id={id}>
            <div className="flex gap-2 items-center z-20">
                {children}
            </div>
            {variant === "pressed" &&
                <span className='absolute inset-0 rounded-lg bg-state-pressed' />
            }
        </div>
    )
}