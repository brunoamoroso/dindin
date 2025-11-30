 import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';

const inputChipsVariants = cva("relative rounded shadow-button text-content-primary label-medium py-1.5 px-3 flex items-center disabled:text-disabled disabled:opacity-50", {
    variants: {
        variant: {
            default: "",
            pressed: "shadow-button-pressed border border-primary bg-primary text-primary pe-2.5"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});

interface InputChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof inputChipsVariants> {
    pressed?: boolean;
}

const InputChips = React.forwardRef<HTMLButtonElement, InputChipProps>(({ className, variant, pressed = false, children, ...props }, ref) => {
    return (
        <button ref={ref} type="button" className={cn(inputChipsVariants({ variant }), className)} {...props}>
            <span className='inline-flex gap-1 z-20'>
                {children}
                {pressed && (<X size={20} />)}
            </span>
            {variant === "pressed" &&
            <span className='absolute inset-0 rounded bg-state-pressed' />
            }
        </button>
    );
});

InputChips.displayName = 'InputChips';

export { InputChips, inputChipsVariants };
