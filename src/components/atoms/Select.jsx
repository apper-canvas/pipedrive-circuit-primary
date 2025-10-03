import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children,
  className,
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-2.5 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer";
  
  const stateStyles = error 
    ? "border-error focus:border-error" 
    : "border-gray-200 focus:border-primary";

  return (
    <select
      ref={ref}
      className={cn(baseStyles, stateStyles, className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;