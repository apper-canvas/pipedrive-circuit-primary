import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Inbox", 
  title = "No data found", 
  description = "Get started by adding your first item",
  actionLabel,
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-full p-8 mb-6">
        <ApperIcon name={icon} size={56} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;