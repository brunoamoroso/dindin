import {cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputChipsVariants = cva("rounded shadow-button text-title label-medium py-1.5 px-3", {
    variants: {
        variant: {
            default: "",
            pressed: "shadow-button-pressed"
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
            {pressed && (<div>oi</div>)}
        </button>
    );
}

export  {InputChips, inputChipsVariants};
