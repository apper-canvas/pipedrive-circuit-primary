import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-gradient-to-r from-primary/10 to-primary/20 text-primary",
    success: "bg-gradient-to-r from-success/10 to-success/20 text-success",
    warning: "bg-gradient-to-r from-warning/10 to-warning/20 text-warning",
    error: "bg-gradient-to-r from-error/10 to-error/20 text-error",
    info: "bg-gradient-to-r from-info/10 to-info/20 text-info"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;