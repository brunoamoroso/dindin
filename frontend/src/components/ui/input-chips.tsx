import {cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const inputChipsVariants = cva("rounded shadow-button text-title label-medium py-1.5 px-3 flex gap-1 items-center disabled:text-disabled disabled:opacity-50", {
    variants: {
        variant: {
            default: "",
            pressed: "shadow-button-pressed border border-primary bg-primary-pressed text-primary-on-pressed pe-2.5"
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
        <button type="button" className={cn(inputChipsVariants({variant}), className)} {...props}>
            {children}
            {pressed && (<X size={20}/>)}
        </button>
    );
}

export  {InputChips, inputChipsVariants};
