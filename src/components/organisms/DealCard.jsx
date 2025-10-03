import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const DealCard = ({ deal, contact, onEdit, onDelete, isDragging }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(value);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 70) return "success";
    if (probability >= 40) return "warning";
    return "error";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 cursor-move border-l-4 border-primary hover:shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight">
{deal.title_c}
          </h4>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(deal);
              }}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <ApperIcon name="Edit2" size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deal.Id);
              }}
              className="text-gray-400 hover:text-error transition-colors"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="User" size={14} />
            <span className="truncate">{contact?.name || "Unknown"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatCurrency(deal.value)}
            </span>
<Badge variant={getProbabilityColor(deal.probability_c)}>
              {deal.probability_c}%
            </Badge>
          </div>

{deal.expected_close_c && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ApperIcon name="Calendar" size={12} />
              <span>Close: {format(new Date(deal.expected_close_c), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;