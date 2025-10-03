import { cn } from "@/utils/cn";

const Card = ({ children, className, hover = false }) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md transition-all duration-200",
      hover && "hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;