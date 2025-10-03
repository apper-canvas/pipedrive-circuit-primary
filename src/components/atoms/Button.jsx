import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:scale-[1.02] focus:ring-primary",
    secondary: "bg-white text-secondary border-2 border-gray-200 hover:border-primary hover:text-primary hover:shadow-md focus:ring-primary",
    ghost: "bg-transparent text-secondary hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-error",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-success"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;