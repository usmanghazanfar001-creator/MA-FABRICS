import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
  {
    variants: {
      variant: {
        primary: "bg-navy text-cream px-8 py-3.5 hover:bg-navy-light",
        gold: "bg-gold text-navy px-8 py-3.5 hover:bg-gold-light",
        outline:
          "border border-current px-8 py-3.5 text-current hover:bg-navy hover:text-cream hover:border-navy",
        ghost: "text-navy hover:text-gold-dark px-2 py-1",
        link: "text-navy underline-offset-4 hover:underline px-0",
      },
      size: {
        default: "",
        sm: "px-5 py-2 text-xs",
        lg: "px-10 py-4 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
