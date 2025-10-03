import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-2.5 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20";
  
  const stateStyles = error 
    ? "border-error focus:border-error" 
    : "border-gray-200 focus:border-primary";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseStyles, stateStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;