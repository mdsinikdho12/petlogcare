import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 text-white hover:bg-brand-600 shadow-sm rounded-full",
        secondary:
          "bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 rounded-full",
        ghost: "text-brand-600 hover:bg-brand-50 rounded-full",
        outline:
          "border border-surface-200 bg-white text-text-primary hover:bg-surface-50 rounded-full",
        danger: "bg-coral-500 text-white hover:bg-coral-600 rounded-full shadow-sm",
        "brand-outline":
          "border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white rounded-full",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
