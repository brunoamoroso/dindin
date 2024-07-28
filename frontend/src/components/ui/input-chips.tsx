import {cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const inputChipsVariants = cva("rounded shadow-button text-title label-medium py-1.5 px-3 flex gap-2 items-center", {
    variants: {
        variant: {
            default: "",
            pressed: "shadow-button-pressed border border-primary bg-primary-pressed text-primary-on-pressed"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});

interface InputChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof inputChipsVariants>{
    pressed?: boolean;
}

const InputChips = ({className, variant, pressed = false, children, ...props}: InputChipProps) => {
    return (
        <button className={cn(inputChipsVariants({variant}), className)} {...props}>
            {children}
            {pressed && (<X size={18}/>)}
        </button>
    );
}

export  {InputChips, inputChipsVariants};
